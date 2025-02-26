<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Country;
use Illuminate\Http\Request;

class CountryController extends Controller
{
    /**
     * Lấy danh sách tất cả các quốc gia
     */
    public function index(Request $request)
    {
        $query = Country::query();
        
        // Filter by topic_id
        if ($request->has('topic_id')) {
            $query->whereHas('topics', function($q) use ($request) {
                $q->where('topics.id', $request->topic_id);
            });
        }

        $countries = $query->get();

        // Transform to add full URLs for images
        $countries->transform(function ($country) {
            $country->flag = url($country->flag);
            $country->image = url($country->image);
            return $country;
        });

        return response()->json($countries);
    }

    /**
     * Tạo một quốc gia mới
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|size:2|unique:countries',
            'flag' => 'nullable|string|url',
            'image' => 'nullable|string|url',
            'is_active' => 'boolean'
        ]);

        $country = Country::create($request->all());
        return response()->json($country, 201);
    }

    /**
     * Lấy thông tin chi tiết của một quốc gia
     */
    public function show(Country $country)
    {
        return response()->json($country);
    }

    /**
     * Cập nhật thông tin của một quốc gia
     */
    public function update(Request $request, Country $country)
    {
        $request->validate([
            'name' => 'string|max:255',
            'code' => 'string|size:2|unique:countries,code,' . $country->id,
            'flag' => 'nullable|string|url',
            'image' => 'nullable|string|url',
            'is_active' => 'boolean'
        ]);

        $country->update($request->all());
        return response()->json($country);
    }

    /**
     * Xóa một quốc gia
     */
    public function destroy(Country $country)
    {
        $country->delete();
        return response()->json(null, 204);
    }
} 