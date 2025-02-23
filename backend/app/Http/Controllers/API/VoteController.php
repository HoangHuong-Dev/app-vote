<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Topic;
use App\Models\Vote;
use App\Models\Club;
use Illuminate\Http\Request;

class VoteController extends Controller
{
    /**
     * Lấy danh sách votes của user hiện tại
     */
    public function index(Request $request)
    {
        $votes = $request->user()->votes()->with(['topic', 'club'])->get();
        return response()->json($votes);
    }

    /**
     * Tạo một vote mới
     * Kiểm tra các điều kiện:
     * - Topic phải đang active
     * - User chưa vote cho topic này
     */
    public function store(Request $request)
    {
        $request->validate([
            'topic_id' => 'required|exists:topics,id',
            'club_id' => 'required|exists:clubs,id',
            'image' => 'nullable|string|url',
            'comment' => 'nullable|string'
        ]);

        $topic = Topic::findOrFail($request->topic_id);
        
        // Kiểm tra topic có đang active
        if (!$topic->isActive()) {
            return response()->json([
                'message' => 'Chủ đề này không trong thời gian vote'
            ], 403);
        }

        // Kiểm tra user đã vote chưa
        if ($request->user()->hasVotedForTopic($topic)) {
            return response()->json([
                'message' => 'Bạn đã vote cho chủ đề này rồi'
            ], 403);
        }

        $vote = Vote::create([
            'user_id' => $request->user()->id,
            'topic_id' => $request->topic_id,
            'club_id' => $request->club_id,
            'image' => $request->image,
            'comment' => $request->comment
        ]);

        // Tăng số lượt vote cho club
        $club = Club::find($request->club_id);
        $club->increment('votes_count');

        return response()->json($vote->load(['topic', 'club']), 201);
    }

    /**
     * Lấy chi tiết một vote
     */
    public function show(Vote $vote)
    {
        $this->authorize('view', $vote);
        return response()->json($vote->load(['topic', 'club']));
    }

    /**
     * Cập nhật comment của vote
     * Chỉ cho phép cập nhật comment, không cho đổi club đã chọn
     */
    public function update(Request $request, Vote $vote)
    {
        $this->authorize('update', $vote);
        
        $request->validate([
            'comment' => 'nullable|string'
        ]);

        $vote->update([
            'comment' => $request->comment
        ]);

        return response()->json($vote->load(['topic', 'club']));
    }

    /**
     * Xóa một vote
     */
    public function destroy(Vote $vote)
    {
        $this->authorize('delete', $vote);
        $vote->delete();
        return response()->json(null, 204);
    }
} 