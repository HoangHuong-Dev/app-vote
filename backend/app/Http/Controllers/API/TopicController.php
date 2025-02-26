<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Topic;
use Illuminate\Http\Request;

class TopicController extends Controller
{
    /**
     * Lấy danh sách tất cả các chủ đề
     * Có thể lọc theo trạng thái active
     */
    public function index(Request $request)
    {
        $query = Topic::query();
        
        if ($request->has('active')) {
            $query->where('is_active', $request->boolean('active'));
        }
        
        $topics = $query->latest()->get();

        // Transform to add full URLs for images
        $topics->transform(function ($topic) {
            $topic->image = url($topic->image);
            return $topic;
        });
        
        return response()->json($topics);
    }

    /**
     * Tạo một chủ đề mới
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after:start_date',
            'is_active' => 'boolean'
        ]);

        $topic = Topic::create($request->all());
        return response()->json($topic, 201);
    }

    /**
     * Lấy thông tin chi tiết của một chủ đề
     * Bao gồm số lượng votes cho từng club
     */
    public function show(Topic $topic)
    {
        // Load countries của topic và clubs của mỗi country
        $topic->load(['countries' => function ($query) {
            $query->with('clubs');
        }]);

        // Transform để thêm full URL cho images
        $topic->image = url($topic->image);
        $topic->countries->transform(function ($country) {
            $country->flag = url($country->flag);
            $country->image = url($country->image);
            return $country;
        });

        return response()->json($topic);
    }

    /**
     * Cập nhật thông tin của một chủ đề
     */
    public function update(Request $request, Topic $topic)
    {
        $request->validate([
            'title' => 'string|max:255',
            'description' => 'string',
            'start_date' => 'date|after_or_equal:today',
            'end_date' => 'date|after:start_date',
            'is_active' => 'boolean'
        ]);

        $topic->update($request->all());
        return response()->json($topic);
    }

    /**
     * Xóa một chủ đề
     */
    public function destroy(Topic $topic)
    {
        $topic->delete();
        return response()->json(null, 204);
    }
} 