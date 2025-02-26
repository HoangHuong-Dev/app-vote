<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Club;
use App\Models\Country;
use Illuminate\Http\JsonResponse;

class RankingController extends Controller
{
    public function getClubRankingsByCountry(Country $country): JsonResponse
    {
        $clubs = Club::where('country_id', $country->id)
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
            'country' => [
                'id' => $country->id,
                'name' => $country->name,
                'flag' => $country->flag ? asset($country->flag) : null,
                'image' => $country->image ? asset( $country->image) : null
            ],
            'clubs' => $clubs
        ]);
    }
} 