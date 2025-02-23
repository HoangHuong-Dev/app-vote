<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Club;
use Illuminate\Http\Request;

class ClubController extends Controller
{
    /**
     * Lấy danh sách tất cả các câu lạc bộ
     * Có thể lọc theo country_id
     */
    public function index(Request $request)
    {
        $query = Club::with('country');
        
        if ($request->has('country_id')) {
            $query->where('country_id', $request->country_id);
        }
        
        $clubs = $query->get();
        return response()->json($clubs);
    }

    /**
     * Tạo một câu lạc bộ mới
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'country_id' => 'required|exists:countries,id',
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
        return response()->json($club->load('country'));
    }

    /**
     * Cập nhật thông tin của một câu lạc bộ
     */
    public function update(Request $request, Club $club)
    {
        $request->validate([
            'name' => 'string|max:255',
            'country_id' => 'exists:countries,id',
            'logo' => 'nullable|string|url',
            'image' => 'nullable|string|url',
            'description' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        $club->update($request->all());
        return response()->json($club->load('country'));
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