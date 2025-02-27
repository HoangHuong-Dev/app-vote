<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Club;
use App\Models\Topic;
use Illuminate\Http\JsonResponse;

class RankingController extends Controller
{
    /**
     * Lấy danh sách club được sắp xếp theo số lượt vote (cao xuống thấp) cho một topic
     */
    public function getTopClubsByTopic(Topic $topic): JsonResponse
    {
        // Lấy tất cả club thuộc các nước trong topic, sắp xếp theo votes_count
        $clubs = Club::whereHas('country.topics', function($query) use ($topic) {
                $query->where('topics.id', $topic->id);
            })
            ->where('is_active', true)
            ->orderByDesc('votes_count')
            ->get()
            ->map(function ($club, $index) {
                return [
                    'id' => $club->id,
                    'name' => $club->name,
                    'logo' => $club->logo ? asset($club->logo) : null,
                    'image' => $club->image ? asset($club->image) : null,
                    'country' => [
                        'id' => $club->country->id,
                        'name' => $club->country->name,
                        'flag' => $club->country->flag ? asset($club->country->flag) : null
                    ],
                    'votes_count' => $club->votes_count,
                    'rank' => $index + 1
                ];
            });

        return response()->json([
            'topic' => [
                'id' => $topic->id,
                'title' => $topic->title,
                'image' => $topic->image ? asset($topic->image) : null
            ],
            'clubs' => $clubs
        ]);
    }
} 