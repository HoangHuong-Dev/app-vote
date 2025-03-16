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
    public function getClubRankings(Request $request)
    {
        $user = $request->user();
        $userVotedClub = null;
        
        if ($user) {
            $userVotedClub = $user->votes()->first();
        }

        $rankings = Club::with(['city.country'])
            ->where('is_active', true)
            ->orderByDesc('votes_count')
            ->get()
            ->map(function ($club) use ($userVotedClub) {
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
                    'votes_count' => $club->votes_count,
                    'color' => $club->color ?? '#' . substr(md5($club->name), 0, 6), // Tạo màu ngẫu nhiên nếu không có màu
                    'is_user_voted' => $userVotedClub ? $userVotedClub->club_id === $club->id : false,
                    'logo' => $club->logo ? asset($club->logo) : null,
                ];
            });

        return response()->json([
            'data' => $rankings
        ]);
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

        return response()->json([
            'data' => $rankings
        ]);
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

        return response()->json([
            'data' => $rankings
        ]);
    }

    public function getClubRankingsByCountry(Country $country)
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

    public function getClubRankingsByCity(City $city)
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