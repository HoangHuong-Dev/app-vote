<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Club;
use App\Models\Country;
use App\Models\City;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RankingController extends Controller
{
    public function getClubRankings()
    {
        $rankings = Club::with(['city.country'])
            ->where('is_active', true)
            ->orderByDesc('votes_count')
            ->get()
            ->map(function ($club) {
                return [
                    'id' => $club->id,
                    'name' => $club->name,
                    'city' => [
                        'id' => $club->city->id,
                        'name' => $club->city->name,
                        'country' => [
                            'id' => $club->city->country->id,
                            'name' => $club->city->country->name
                        ]
                    ],
                    'latitude' => $club->latitude,
                    'longitude' => $club->longitude,
                    'votes_count' => $club->votes_count
                ];
            });

        return response()->json($rankings);
    }

    public function getCountryRankings()
    {
        $rankings = Country::select(
                'countries.*',
                DB::raw('(
                    SELECT SUM(clubs.votes_count) 
                    FROM clubs 
                    JOIN cities ON clubs.city_id = cities.id
                    WHERE cities.country_id = countries.id
                    AND clubs.is_active = 1
                ) as votes_count')
            )
            ->orderByDesc(DB::raw('votes_count'))
            ->get()
            ->map(function ($country) {
                return [
                    'id' => $country->id,
                    'name' => $country->name,
                    'votes_count' => $country->votes_count ?? 0
                ];
            });

        return response()->json($rankings);
    }

    public function getCityRankings()
    {
        $rankings = City::select(
                'cities.*',
                DB::raw('(
                    SELECT SUM(clubs.votes_count) 
                    FROM clubs 
                    WHERE clubs.city_id = cities.id
                    AND clubs.is_active = 1
                ) as votes_count')
            )
            ->with('country')
            ->orderByDesc(DB::raw('votes_count'))
            ->get()
            ->map(function ($city) {
                return [
                    'id' => $city->id,
                    'name' => $city->name,
                    'country' => [
                        'id' => $city->country->id,
                        'name' => $city->country->name
                    ],
                    'votes_count' => $city->votes_count ?? 0
                ];
            });

        return response()->json($rankings);
    }

    public function searchClubs(Request $request)
    {
        $query = $request->get('q', '');
        
        $clubs = Club::with(['city.country'])
            ->where('is_active', true)
            ->where(function($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                  ->orWhereHas('city', function($q) use ($query) {
                      $q->where('name', 'like', "%{$query}%");
                  })
                  ->orWhereHas('city.country', function($q) use ($query) {
                      $q->where('name', 'like', "%{$query}%");
                  });
            })
            ->orderByDesc('votes_count')
            ->limit(10)
            ->get()
            ->map(function ($club) {
                return [
                    'id' => $club->id,
                    'name' => $club->name,
                    'city' => [
                        'id' => $club->city->id,
                        'name' => $club->city->name,
                        'country' => [
                            'id' => $club->city->country->id,
                            'name' => $club->city->country->name
                        ]
                    ],
                    'latitude' => $club->latitude,
                    'longitude' => $club->longitude,
                    'votes_count' => $club->votes_count
                ];
            });

        return response()->json($clubs);
    }

    public function getClubRankingsByCountry(Country $country): JsonResponse
    {
        $clubs = Club::whereHas('city', function($query) use ($country) {
                $query->where('country_id', $country->id);
            })
            ->withCount('votes')
            ->orderByDesc('votes_count')
            ->get()
            ->map(function ($club, $index) {
                return [
                    'id' => $club->id,
                    'name' => $club->name,
                    'logo' => $club->logo ? asset($club->logo) : null,
                    'votes_count' => $club->votes_count,
                    'rank' => $index + 1,
                    'city' => [
                        'id' => $club->city->id,
                        'name' => $club->city->name
                    ]
                ];
            });

        return response()->json([
            'country' => [
                'id' => $country->id,
                'name' => $country->name,
                'flag' => $country->flag ? asset($country->flag) : null,
                'image' => $country->image ? asset($country->image) : null
            ],
            'clubs' => $clubs
        ]);
    }

    public function getClubRankingsByCity(City $city): JsonResponse
    {
        $clubs = Club::where('city_id', $city->id)
            ->withCount('votes')
            ->orderByDesc('votes_count')
            ->get()
            ->map(function ($club, $index) {
                return [
                    'id' => $club->id,
                    'name' => $club->name,
                    'logo' => $club->logo ? asset($club->logo) : null,
                    'votes_count' => $club->votes_count,
                    'rank' => $index + 1
                ];
            });

        return response()->json([
            'city' => [
                'id' => $city->id,
                'name' => $city->name,
                'country' => [
                    'id' => $city->country->id,
                    'name' => $city->country->name,
                    'flag' => $city->country->flag ? asset($city->country->flag) : null
                ]
            ],
            'clubs' => $clubs
        ]);
    }
} 