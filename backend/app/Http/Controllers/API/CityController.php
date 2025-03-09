<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\City;
use App\Models\Country;
use Illuminate\Http\Request;

class CityController extends Controller
{
    /**
     * Lấy danh sách tất cả các thành phố
     * Có thể lọc theo country_id
     */
    public function index(Request $request)
    {
        $query = City::query();
        
        // Filter by country_id
        if ($request->has('country_id')) {
            $query->where('country_id', $request->country_id);
        }

        // Filter by is_active
        if ($request->has('active')) {
            $query->where('is_active', $request->boolean('active'));
        }

        $cities = $query->with('country')->get();
        
        return response()->json($cities);
    }

    /**
     * Lấy danh sách thành phố theo quốc gia
     */
    public function getCitiesByCountry(Country $country)
    {
        $cities = City::where('country_id', $country->id)
            ->where('is_active', true)
            ->get();
        
        return response()->json($cities);
    }

    /**
     * Tạo một thành phố mới
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'country_id' => 'required|exists:countries,id',
            'is_active' => 'boolean'
        ]);

        $city = City::create($request->all());
        return response()->json($city, 201);
    }

    /**
     * Lấy thông tin chi tiết của một thành phố
     */
    public function show(City $city)
    {
        return response()->json($city->load('country'));
    }

    /**
     * Cập nhật thông tin của một thành phố
     */
    public function update(Request $request, City $city)
    {
        $request->validate([
            'name' => 'string|max:255',
            'country_id' => 'exists:countries,id',
            'is_active' => 'boolean'
        ]);

        $city->update($request->all());
        return response()->json($city->load('country'));
    }

    /**
     * Xóa một thành phố
     */
    public function destroy(City $city)
    {
        $city->delete();
        return response()->json(null, 204);
    }
} 