<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Club;
use App\Models\City;
use Illuminate\Http\Request;

class ClubController extends Controller
{
    /**
     * Lấy danh sách tất cả các câu lạc bộ
     * Có thể lọc theo city_id, country_id và topic_id
     */
    public function index(Request $request)
    {
        $query = Club::query();
        
        // Filter by city_id
        if ($request->has('city_id')) {
            $query->where('city_id', $request->city_id);
        }
        
        // Filter by country_id
        if ($request->has('country_id')) {
            $query->whereHas('city', function($q) use ($request) {
                $q->where('country_id', $request->country_id);
            });
        }

        // Filter by topic_id through country
        if ($request->has('topic_id')) {
            $query->whereHas('city.country.topics', function($q) use ($request) {
                $q->where('topics.id', $request->topic_id);
            });
        }

        $clubs = $query->with('city.country')->get();

        // Transform to add full URLs for images
        $clubs->transform(function ($club) {
            $club->logo = url($club->logo);
            $club->image = url($club->image);
            return $club;
        });
        
        return response()->json($clubs);
    }

    /**
     * Tạo một câu lạc bộ mới
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'city_id' => 'required|exists:cities,id',
            'logo' => 'nullable|string|url',
            'image' => 'nullable|string|url',
            'description' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        $club = Club::create($request->all());
        return response()->json($club, 201);
    }

    /**
     * Lấy thông tin chi tiết của một câu lạc bộ
     */
    public function show(Club $club)
    {
        return response()->json($club->load('city.country'));
    }

    /**
     * Cập nhật thông tin của một câu lạc bộ
     */
    public function update(Request $request, Club $club)
    {
        $request->validate([
            'name' => 'string|max:255',
            'city_id' => 'exists:cities,id',
            'logo' => 'nullable|string|url',
            'image' => 'nullable|string|url',
            'description' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        $club->update($request->all());
        return response()->json($club->load('city.country'));
    }

    /**
     * Xóa một câu lạc bộ
     */
    public function destroy(Club $club)
    {
        $club->delete();
        return response()->json(null, 204);
    }
} 