@extends('admin.layouts.app')

@section('content')
<div class="flex-1">
    <!-- Header -->
    <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto py-6 px-4">
            <div class="flex justify-between items-center">
                <h2 class="text-3xl font-bold text-gray-800">Club Management</h2>
                <button onclick="openCreateModal()" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    <i class="fas fa-plus mr-2"></i>Add New Club
                </button>
            </div>
        </div>
    </header>

    <!-- Main Content Area -->
    <main class="max-w-7xl mx-auto py-6 px-4">
        @if(session('success'))
            <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                <span class="block sm:inline">{{ session('success') }}</span>
            </div>
        @endif

        <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <table class="datatable w-full">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logo</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Votes</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    @foreach($clubs as $club)
                    <tr class="hover:bg-gray-50">
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ $club->id }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center space-x-4">
                                <div class="flex-shrink-0 h-12 w-12">
                                    @if($club->logo)
                                        <img class="h-12 w-12 rounded-lg object-cover shadow-sm" 
                                             src="{{ asset($club->logo) }}" 
                                             alt="{{ $club->name }} logo">
                                    @else
                                        <div class="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                                            <i class="fas fa-futbol text-gray-400 text-2xl"></i>
                                        </div>
                                    @endif
                                </div>
                                @if($club->image)
                                    <div class="flex-shrink-0 h-12 w-12">
                                        <img class="h-12 w-12 rounded-lg object-cover shadow-sm" 
                                             src="{{ asset($club->image) }}" 
                                             alt="{{ $club->name }} image">
                                    </div>
                                @endif
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ $club->name }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            @if($club->city)
                                {{ $club->city->name }} 
                                @if($club->city->country)
                                    ({{ $club->city->country->name }})
                                @endif
                            @else
                                <span class="text-red-500">No city assigned</span>
                            @endif
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ $club->votes_count }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            @if($club->latitude && $club->longitude)
                                <span class="text-gray-600">
                                    {{ number_format($club->latitude, 6) }}, {{ number_format($club->longitude, 6) }}
                                </span>
                            @else
                                <span class="text-gray-400 italic">No location</span>
                            @endif
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {{ $club->is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800' }}">
                                {{ $club->is_active ? 'Active' : 'Inactive' }}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm">
                            <div class="flex space-x-3">
                                <button onclick="openEditModal(
                                    {{ $club->id }}, 
                                    '{{ $club->name }}', 
                                    {{ $club->city_id ?? 'null' }}, 
                                    {{ $club->city && $club->city->country ? $club->city->country->id : 'null' }}, 
                                    '{{ $club->logo ?? '' }}', 
                                    '{{ $club->image ?? '' }}', 
                                    '{{ addslashes($club->description ?? '') }}', 
                                    {{ $club->is_active ? 'true' : 'false' }},
                                    {{ $club->latitude ?? 'null' }},
                                    {{ $club->longitude ?? 'null' }}
                                )" class="text-blue-600 hover:text-blue-900">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button onclick="openDeleteModal({{ $club->id }})" class="text-red-600 hover:text-red-900">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </main>
</div>

<!-- Create/Edit Club Modal -->
<div id="clubModal" class="fixed z-10 inset-0 overflow-y-auto hidden">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <form id="clubForm" method="POST" action="{{ route('admin.clubs.store') }}" enctype="multipart/form-data">
                @csrf
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <h3 class="text-lg font-medium text-gray-900" id="modalTitle">Create New Club</h3>
                    <div class="mt-4">
                        <input type="hidden" name="_method" value="POST">
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2">Name</label>
                            <input type="text" name="name" required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                        </div>
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2">Country</label>
                            <select id="country_selector" name="country_id" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                <option value="">Select Country</option>
                                @foreach($countries as $country)
                                    <option value="{{ $country->id }}">{{ $country->name }}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2">City</label>
                            <select name="city_id" id="city_selector" required class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                <option value="">Select City</option>
                                @foreach($cities as $city)
                                    <option value="{{ $city->id }}" data-country="{{ $city->country_id }}">{{ $city->name }}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2">Logo</label>
                            <div class="flex items-center">
                                <div class="w-20 h-20 mr-4 flex-shrink-0">
                                    <img id="logoPreview" class="w-full h-full object-cover rounded-lg" 
                                         src="{{ asset('images/placeholder.png') }}" alt="Logo preview">
                                </div>
                                <div class="flex-1">
                                    <input type="file" name="logo" accept="image/*" 
                                           class="block w-full text-sm text-gray-500
                                                  file:mr-4 file:py-2 file:px-4
                                                  file:rounded-full file:border-0
                                                  file:text-sm file:font-semibold
                                                  file:bg-blue-50 file:text-blue-700
                                                  hover:file:bg-blue-100"
                                           onchange="previewImage(this, 'logoPreview')">
                                    <p class="mt-1 text-sm text-gray-500">PNG, JPG up to 2MB</p>
                                </div>
                            </div>
                        </div>
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2">Image</label>
                            <div class="flex items-center">
                                <div class="w-20 h-20 mr-4 flex-shrink-0">
                                    <img id="imagePreview" class="w-full h-full object-cover rounded-lg" 
                                         src="{{ asset('images/placeholder.png') }}" alt="Image preview">
                                </div>
                                <div class="flex-1">
                                    <input type="file" name="image" accept="image/*" 
                                           class="block w-full text-sm text-gray-500
                                                  file:mr-4 file:py-2 file:px-4
                                                  file:rounded-full file:border-0
                                                  file:text-sm file:font-semibold
                                                  file:bg-blue-50 file:text-blue-700
                                                  hover:file:bg-blue-100"
                                           onchange="previewImage(this, 'imagePreview')">
                                    <p class="mt-1 text-sm text-gray-500">PNG, JPG up to 2MB</p>
                                </div>
                            </div>
                        </div>
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2">Description</label>
                            <textarea name="description" rows="3" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
                        </div>
                        <div class="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label class="block text-gray-700 text-sm font-bold mb-2">Latitude</label>
                                <input type="number" name="latitude" step="any" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="e.g. 45.4642">
                            </div>
                            <div>
                                <label class="block text-gray-700 text-sm font-bold mb-2">Longitude</label>
                                <input type="number" name="longitude" step="any" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="e.g. 9.1900">
                            </div>
                        </div>
                        <div class="mb-4">
                            <label class="flex items-center">
                                <input type="checkbox" name="is_active" value="1" class="form-checkbox h-4 w-4 text-blue-600">
                                <span class="ml-2 text-gray-700">Active</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button type="submit" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                        Save
                    </button>
                    <button type="button" onclick="closeModal()" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Delete Confirmation Modal -->
<div id="deleteModal" class="fixed z-10 inset-0 overflow-y-auto hidden">
    <div class="flex items-center justify-center min-h-screen">
        <div class="fixed inset-0 transition-opacity">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div class="relative bg-white rounded-lg w-96">
            <div class="p-6">
                <h3 class="text-lg font-medium text-gray-900">Confirm Delete</h3>
                <p class="mt-2 text-sm text-gray-500">Are you sure you want to delete this club? This action cannot be undone.</p>
                <div class="mt-4 flex justify-end">
                    <form id="deleteForm" method="POST">
                        @csrf
                        @method('DELETE')
                        <button type="button" onclick="closeDeleteModal()" class="mr-2 inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                            Cancel
                        </button>
                        <button type="submit" class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700">
                            Delete
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@section('scripts')
<script>
    function openCreateModal() {
        document.getElementById('modalTitle').textContent = 'Create New Club';
        document.getElementById('clubForm').action = '{{ route("admin.clubs.store") }}';
        document.getElementById('clubForm').querySelector('input[name="_method"]').value = 'POST';
        document.getElementById('clubForm').reset();
        document.getElementById('clubModal').classList.remove('hidden');
        
        // Hide all city options initially
        const citySelector = document.getElementById('city_selector');
        const cityOptions = citySelector.querySelectorAll('option');
        cityOptions.forEach(option => {
            if (option.value === '') {
                option.style.display = 'block';
            } else {
                option.style.display = 'none';
            }
        });
    }

    function openEditModal(id, name, cityId, countryId, logo, image, description, isActive, latitude, longitude) {
        document.getElementById('modalTitle').textContent = 'Edit Club';
        document.getElementById('clubForm').action = `/admin/clubs/${id}`;
        document.getElementById('clubForm').querySelector('input[name="_method"]').value = 'PUT';
        
        const form = document.getElementById('clubForm');
        form.querySelector('input[name="name"]').value = name || '';
        
        // Set country first if exists
        const countrySelector = document.getElementById('country_selector');
        if (countryId && countryId !== 'null') {
            countrySelector.value = countryId;
            
            // Filter cities based on country
            filterCitiesByCountry(countryId);
            
            // Set city if exists
            if (cityId && cityId !== 'null') {
                setTimeout(() => {
                    const citySelector = document.getElementById('city_selector');
                    citySelector.value = cityId;
                }, 100);
            }
        } else {
            countrySelector.value = '';
            // Reset city selection
            const citySelector = document.getElementById('city_selector');
            citySelector.value = '';
        }
        
        form.querySelector('textarea[name="description"]').value = description || '';
        form.querySelector('input[name="is_active"]').checked = isActive;
        
        // Set latitude and longitude if they exist
        if (arguments.length > 10) {
            form.querySelector('input[name="latitude"]').value = latitude || '';
            form.querySelector('input[name="longitude"]').value = longitude || '';
        }
        
        // Preview existing images
        const logoPreview = document.getElementById('logoPreview');
        if (logo && logo !== '') {
            logoPreview.src = logo;
            logoPreview.style.display = 'block';
        } else {
            logoPreview.style.display = 'none';
        }
        
        const imagePreview = document.getElementById('imagePreview');
        if (image && image !== '') {
            imagePreview.src = image;
            imagePreview.style.display = 'block';
        } else {
            imagePreview.style.display = 'none';
        }
        
        document.getElementById('clubModal').classList.remove('hidden');
    }
    
    // Filter cities based on selected country
    function filterCitiesByCountry(countryId) {
        if (!countryId || countryId === 'null') return;
        
        const citySelector = document.getElementById('city_selector');
        const cityOptions = citySelector.querySelectorAll('option');
        
        cityOptions.forEach(option => {
            if (option.value === '' || option.getAttribute('data-country') === countryId.toString()) {
                option.style.display = 'block';
            } else {
                option.style.display = 'none';
            }
        });
        
        // Reset city selection
        citySelector.value = '';
    }
    
    // Add event listener to country selector
    document.addEventListener('DOMContentLoaded', function() {
        const countrySelector = document.getElementById('country_selector');
        if (countrySelector) {
            countrySelector.addEventListener('change', function() {
                filterCitiesByCountry(this.value);
            });
        }
    });

    function closeModal() {
        document.getElementById('clubModal').classList.add('hidden');
        document.getElementById('clubForm').reset();
    }

    function openDeleteModal(id) {
        document.getElementById('deleteForm').action = `/admin/clubs/${id}`;
        document.getElementById('deleteModal').classList.remove('hidden');
    }

    function closeDeleteModal() {
        document.getElementById('deleteModal').classList.add('hidden');
    }

    function previewImage(input, previewId) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById(previewId).src = e.target.result;
            }
            reader.readAsDataURL(input.files[0]);
        }
    }
</script>
@endsection

@section('styles')
<style>
    /* Custom DataTables styling */
    .dataTables_wrapper .dataTables_length select {
        @apply rounded border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50;
    }
    
    .dataTables_wrapper .dataTables_filter input {
        @apply rounded border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50;
    }
    
    .dataTables_wrapper .dataTables_paginate .paginate_button {
        @apply px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-gray-700 bg-transparent hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-900 transition duration-150 ease-in-out;
    }
    
    .dataTables_wrapper .dataTables_paginate .paginate_button.current {
        @apply bg-blue-100 text-blue-700 hover:bg-blue-200;
    }
</style>
@endsection 