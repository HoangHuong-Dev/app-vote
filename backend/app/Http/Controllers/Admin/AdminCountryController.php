<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Country;
use Illuminate\Http\Request;

class AdminCountryController extends Controller
{
    public function index()
    {
        $countries = Country::query()
            ->when(request('search'), function($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('code', 'like', "%{$search}%");
            })
            ->orderBy('id', 'desc')
            ->get();

        return view('admin.countries.index', compact('countries'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|size:2|unique:countries',
            'flag' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'is_active' => 'boolean'
        ]);

        if ($request->hasFile('flag')) {
            $fileName = time() . '_flag_' . $request->file('flag')->getClientOriginalName();
            $request->file('flag')->move(public_path('uploads/countries'), $fileName);
            $validated['flag'] = '/uploads/countries/' . $fileName;
        }

        if ($request->hasFile('image')) {
            $fileName = time() . '_image_' . $request->file('image')->getClientOriginalName();
            $request->file('image')->move(public_path('uploads/countries'), $fileName);
            $validated['image'] = '/uploads/countries/' . $fileName;
        }

        Country::create($validated);
        return redirect()->route('admin.countries.index')->with('success', 'Country created successfully.');
    }

    public function update(Request $request, Country $country)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|size:2|unique:countries,code,' . $country->id,
            'flag' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'is_active' => 'boolean'
        ]);

        if ($request->hasFile('flag')) {
            if ($country->flag && file_exists(public_path($country->flag))) {
                unlink(public_path($country->flag));
            }
            $fileName = time() . '_flag_' . $request->file('flag')->getClientOriginalName();
            $request->file('flag')->move(public_path('uploads/countries'), $fileName);
            $validated['flag'] = '/uploads/countries/' . $fileName;
        }

        if ($request->hasFile('image')) {
            if ($country->image && file_exists(public_path($country->image))) {
                unlink(public_path($country->image));
            }
            $fileName = time() . '_image_' . $request->file('image')->getClientOriginalName();
            $request->file('image')->move(public_path('uploads/countries'), $fileName);
            $validated['image'] = '/uploads/countries/' . $fileName;
        }

        $country->update($validated);
        return redirect()->route('admin.countries.index')->with('success', 'Country updated successfully.');
    }

    public function destroy(Country $country)
    {
        if ($country->flag && file_exists(public_path($country->flag))) {
            unlink(public_path($country->flag));
        }
        if ($country->image && file_exists(public_path($country->image))) {
            unlink(public_path($country->image));
        }
        
        $country->delete();
        return redirect()->route('admin.countries.index')->with('success', 'Country deleted successfully.');
    }
} 