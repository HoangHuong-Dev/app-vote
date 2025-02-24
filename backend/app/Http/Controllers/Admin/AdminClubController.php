<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Club;
use App\Models\Country;
use Illuminate\Http\Request;
use App\Traits\UploadTrait;

class AdminClubController extends Controller
{
    use UploadTrait;

    public function index()
    {
        $clubs = Club::query()
            ->with('country')
            ->when(request('search'), function($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhereHas('country', function($q) use ($search) {
                          $q->where('name', 'like', "%{$search}%");
                      });
            })
            ->orderBy('id', 'desc')
            ->get();

        $countries = Country::all();
        return view('admin.clubs.index', compact('clubs', 'countries'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'country_id' => 'required|exists:countries,id',
            'logo' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'description' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        if ($request->hasFile('logo')) {
            $fileName = time() . '_logo_' . $request->file('logo')->getClientOriginalName();
            $request->file('logo')->move(public_path('uploads/clubs'), $fileName);
            $validated['logo'] = '/uploads/clubs/' . $fileName;
        }

        if ($request->hasFile('image')) {
            $fileName = time() . '_image_' . $request->file('image')->getClientOriginalName();
            $request->file('image')->move(public_path('uploads/clubs'), $fileName);
            $validated['image'] = '/uploads/clubs/' . $fileName;
        }

        Club::create($validated);
        return redirect()->route('admin.clubs.index')->with('success', 'Club created successfully.');
    }

    public function update(Request $request, Club $club)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'country_id' => 'required|exists:countries,id',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'description' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        if ($request->hasFile('logo')) {
            if ($club->logo && file_exists(public_path($club->logo))) {
                unlink(public_path($club->logo));
            }
            $fileName = time() . '_logo_' . $request->file('logo')->getClientOriginalName();
            $request->file('logo')->move(public_path('uploads/clubs'), $fileName);
            $validated['logo'] = '/uploads/clubs/' . $fileName;
        }

        if ($request->hasFile('image')) {
            if ($club->image && file_exists(public_path($club->image))) {
                unlink(public_path($club->image));
            }
            $fileName = time() . '_image_' . $request->file('image')->getClientOriginalName();
            $request->file('image')->move(public_path('uploads/clubs'), $fileName);
            $validated['image'] = '/uploads/clubs/' . $fileName;
        }

        $club->update($validated);
        return redirect()->route('admin.clubs.index')->with('success', 'Club updated successfully.');
    }

    public function destroy(Club $club)
    {
        if ($club->logo && file_exists(public_path($club->logo))) {
            unlink(public_path($club->logo));
        }
        if ($club->image && file_exists(public_path($club->image))) {
            unlink(public_path($club->image));
        }
        
        $club->delete();
        return redirect()->route('admin.clubs.index')->with('success', 'Club deleted successfully.');
    }
} 