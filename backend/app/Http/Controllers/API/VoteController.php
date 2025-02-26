<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Topic;
use App\Models\Vote;
use App\Models\Club;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
            'club_id' => 'required|exists:clubs,id'
        ]);

        $topic = Topic::findOrFail($request->topic_id);
        
        // Check if user already voted for this topic
        $hasVotedForTopic = $request->user()->votes()
            ->where('topic_id', $topic->id)
            ->exists();

        if ($hasVotedForTopic) {
            return response()->json([
                'message' => 'You have already voted for this topic'
            ], 403);
        }

        // Create vote in transaction
        DB::beginTransaction();
        try {
            $vote = Vote::create([
                'user_id' => $request->user()->id,
                'topic_id' => $request->topic_id,
                'club_id' => $request->club_id
            ]);

            // Increment vote count
            Club::where('id', $request->club_id)->increment('votes_count');
            
            DB::commit();
            return response()->json($vote->load(['topic', 'club']), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to submit vote'
            ], 500);
        }
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