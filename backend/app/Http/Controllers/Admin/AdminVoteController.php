<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Vote;
use App\Models\Topic;
use App\Models\Club;
use Illuminate\Http\Request;

class AdminVoteController extends Controller
{
    public function index()
    {
        $votes = Vote::query()
            ->with(['user', 'topic', 'club'])
            ->when(request('search'), function($query, $search) {
                $query->whereHas('user', function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                })
                ->orWhereHas('topic', function($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%");
                })
                ->orWhereHas('club', function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
            })
            ->orderBy('id', 'desc')
            ->get();

        return view('admin.votes.index', compact('votes'));
    }

    public function show(Vote $vote)
    {
        $vote->load(['user', 'topic', 'club']);
        return view('admin.votes.show', compact('vote'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'topic_id' => 'required|exists:topics,id',
            'club_id' => 'required|exists:clubs,id',
            'image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'comment' => 'nullable|string'
        ]);

        if ($request->hasFile('image')) {
            $fileName = time() . '_' . $request->file('image')->getClientOriginalName();
            $request->file('image')->move(public_path('uploads/votes'), $fileName);
            $validated['image'] = '/uploads/votes/' . $fileName;
        }

        Vote::create($validated);
        return redirect()->route('admin.votes.index')->with('success', 'Vote created successfully.');
    }

    public function destroy(Vote $vote)
    {
        if ($vote->image && file_exists(public_path($vote->image))) {
            unlink(public_path($vote->image));
        }
        
        $vote->delete();
        return redirect()->route('admin.votes.index')->with('success', 'Vote deleted successfully.');
    }
} 