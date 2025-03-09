@extends('admin.layouts.app')

@section('content')
<div class="flex-1">
    <!-- Header -->
    <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto py-6 px-4">
            <div class="flex justify-between items-center">
                <h2 class="text-3xl font-bold text-gray-800">City Management</h2>
                <button onclick="openCreateModal()" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    <i class="fas fa-plus mr-2"></i>Add New City
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
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    @foreach($cities as $city)
                    <tr class="hover:bg-gray-50">
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ $city->id }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ $city->name }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ $city->country->name }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {{ $city->is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800' }}">
                                {{ $city->is_active ? 'Active' : 'Inactive' }}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm">
                            <div class="flex space-x-3">
                                <button onclick="openEditModal({{ $city->id }}, '{{ $city->name }}', {{ $city->country_id }}, {{ $city->is_active }})" class="text-blue-600 hover:text-blue-900">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button onclick="openDeleteModal({{ $city->id }})" class="text-red-600 hover:text-red-900">
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

<!-- Create/Edit City Modal -->
<div id="cityModal" class="fixed z-10 inset-0 overflow-y-auto hidden">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <form id="cityForm" method="POST" action="{{ route('admin.cities.store') }}">
                @csrf
                <input type="hidden" name="_method" value="POST">
                
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <h3 class="text-lg font-medium text-gray-900" id="modalTitle">Create New City</h3>
                    <div class="mt-4">
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2">Name</label>
                            <input type="text" name="name" required 
                                   class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                        </div>
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2">Country</label>
                            <select name="country_id" required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                <option value="">Select Country</option>
                                @foreach($countries as $country)
                                    <option value="{{ $country->id }}">{{ $country->name }}</option>
                                @endforeach
                            </select>
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
                <p class="mt-2 text-sm text-gray-500">Are you sure you want to delete this city? This action cannot be undone.</p>
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
        document.getElementById('modalTitle').textContent = 'Create New City';
        document.getElementById('cityForm').action = '{{ route("admin.cities.store") }}';
        document.getElementById('cityForm').querySelector('input[name="_method"]').value = 'POST';
        document.getElementById('cityForm').reset();
        document.getElementById('cityModal').classList.remove('hidden');
    }

    function openEditModal(id, name, countryId, isActive) {
        document.getElementById('modalTitle').textContent = 'Edit City';
        document.getElementById('cityForm').action = `/admin/cities/${id}`;
        document.getElementById('cityForm').querySelector('input[name="_method"]').value = 'PUT';
        
        const form = document.getElementById('cityForm');
        form.querySelector('input[name="name"]').value = name;
        form.querySelector('select[name="country_id"]').value = countryId;
        form.querySelector('input[name="is_active"]').checked = isActive;
        
        document.getElementById('cityModal').classList.remove('hidden');
    }

    function closeModal() {
        document.getElementById('cityModal').classList.add('hidden');
        document.getElementById('cityForm').reset();
    }

    function openDeleteModal(id) {
        document.getElementById('deleteForm').action = `/admin/cities/${id}`;
        document.getElementById('deleteModal').classList.remove('hidden');
    }

    function closeDeleteModal() {
        document.getElementById('deleteModal').classList.add('hidden');
    }
</script>
@endsection 