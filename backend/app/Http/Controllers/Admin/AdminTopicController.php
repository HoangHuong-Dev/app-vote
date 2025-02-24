<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Topic;
use App\Models\Vote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AdminTopicController extends Controller
{
    public function index()
    {
        $topics = Topic::query()
            ->when(request('search'), function($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
            })
            ->orderBy('id', 'desc')
            ->get();

        return view('admin.topics.index', compact('topics'));
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'image' => 'required|image|max:2048',
                'start_date' => 'required|date',
                'end_date' => 'required|date|after:start_date',
                'is_active' => 'nullable|boolean'
            ]);

            if ($request->hasFile('image')) {
                $fileName = time() . '_' . $request->file('image')->getClientOriginalName();
                $request->file('image')->move(public_path('uploads/topics'), $fileName);
                $validated['image'] = '/uploads/topics/' . $fileName;
            }

            $validated['is_active'] = $request->has('is_active');

            Topic::create($validated);
            return redirect()->route('admin.topics.index')->with('success', 'Topic created successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to create topic: ' . $e->getMessage())->withInput();
        }
    }

    public function update(Request $request, Topic $topic)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after:start_date',
            'is_active' => 'nullable|boolean'
        ]);

        if ($request->hasFile('image')) {
            if ($topic->image && file_exists(public_path($topic->image))) {
                unlink(public_path($topic->image));
            }
            $fileName = time() . '_' . $request->file('image')->getClientOriginalName();
            $request->file('image')->move(public_path('uploads/topics'), $fileName);
            $validated['image'] = '/uploads/topics/' . $fileName;
        }

        $validated['is_active'] = $request->has('is_active');

        $topic->update($validated);
        return redirect()->route('admin.topics.index')->with('success', 'Topic updated successfully.');
    }

    public function destroy(Topic $topic)
    {
        if ($topic->image && file_exists(public_path($topic->image))) {
            unlink(public_path($topic->image));
        }
        
        $topic->delete();
        return redirect()->route('admin.topics.index')->with('success', 'Topic deleted successfully.');
    }

    public function showStats(Topic $topic)
    {
        $voteStats = Vote::where('topic_id', $topic->id)
            ->select('club_id', DB::raw('count(*) as vote_count'))
            ->with('club.country')
            ->groupBy('club_id')
            ->orderBy('vote_count', 'desc')
            ->get();

        return view('admin.topics.stats', compact('topic', 'voteStats'));
    }

    public function toggleStatus(Topic $topic)
    {
        $topic->is_active = !$topic->is_active;
        $topic->save();

        return back()->with('success', 'Topic status updated successfully.');
    }
} 