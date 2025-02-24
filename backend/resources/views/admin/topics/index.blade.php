@extends('admin.layouts.app')

@section('content')
<div class="flex-1">
    <!-- Header -->
    <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto py-6 px-4">
            <div class="flex justify-between items-center">
                <h2 class="text-3xl font-bold text-gray-800">Topic Management</h2>
                <button onclick="openCreateModal()" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    <i class="fas fa-plus mr-2"></i>Add New Topic
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

        @if(session('error'))
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <span class="block sm:inline">{{ session('error') }}</span>
            </div>
        @endif

        @if ($errors->any())
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                <ul>
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <table class="datatable w-full">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title & Description</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    @foreach($topics as $topic)
                    <tr class="hover:bg-gray-50">
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ $topic->id }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex-shrink-0 h-12 w-12">
                                @if($topic->image)
                                    <img class="h-12 w-12 rounded-lg object-cover shadow-sm" 
                                         src="{{ asset($topic->image) }}" 
                                         alt="{{ $topic->title }}">
                                @else
                                    <div class="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                                        <i class="fas fa-image text-gray-400 text-2xl"></i>
                                    </div>
                                @endif
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm font-medium text-gray-900">{{ $topic->title }}</div>
                            <div class="text-sm text-gray-500">{{ Str::limit($topic->description, 50) }}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div>Start: {{ $topic->start_date->format('Y-m-d H:i') }}</div>
                            <div>End: {{ $topic->end_date->format('Y-m-d H:i') }}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {{ $topic->is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800' }}">
                                {{ $topic->is_active ? 'Active' : 'Inactive' }}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm">
                            <div class="flex space-x-3">
                                <a href="{{ route('admin.topics.stats', $topic->id) }}" class="text-blue-600 hover:text-blue-900" title="View Statistics">
                                    <i class="fas fa-chart-bar"></i>
                                </a>
                                <button onclick="openEditModal({{ $topic->id }}, '{{ $topic->title }}', '{{ $topic->description }}', '{{ $topic->image }}', '{{ $topic->start_date->format('Y-m-d\TH:i') }}', '{{ $topic->end_date->format('Y-m-d\TH:i') }}', {{ $topic->is_active }})" class="text-blue-600 hover:text-blue-900">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button onclick="openDeleteModal({{ $topic->id }})" class="text-red-600 hover:text-red-900">
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

<!-- Create/Edit Topic Modal -->
<div id="topicModal" class="fixed z-10 inset-0 overflow-y-auto hidden">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <form id="topicForm" method="POST" action="{{ route('admin.topics.store') }}" enctype="multipart/form-data">
                @csrf
                <input type="hidden" name="_method" value="POST">
                
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <h3 class="text-lg font-medium text-gray-900" id="modalTitle">Create New Topic</h3>
                    <div class="mt-4">
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2">Title</label>
                            <input type="text" name="title" required 
                                   class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                        </div>
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2">Description</label>
                            <textarea name="description" rows="3" required
                                      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
                        </div>
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2">Image</label>
                            <input type="file" name="image" accept="image/*" 
                                   class="block w-full text-sm text-gray-500"
                                   onchange="previewImage(this, 'imagePreview')">
                            <div class="mt-2">
                                <img id="imagePreview" class="h-20 w-20 object-cover rounded-lg" 
                                     src="{{ asset('images/placeholder.png') }}" alt="Preview">
                            </div>
                        </div>
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2">Start Date</label>
                            <input type="datetime-local" name="start_date" required 
                                   class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                        </div>
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2">End Date</label>
                            <input type="datetime-local" name="end_date" required 
                                   class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
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
                <p class="mt-2 text-sm text-gray-500">Are you sure you want to delete this topic? This action cannot be undone.</p>
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
        document.getElementById('modalTitle').textContent = 'Create New Topic';
        document.getElementById('topicForm').action = '{{ route("admin.topics.store") }}';
        document.getElementById('topicForm').querySelector('input[name="_method"]').value = 'POST';
        document.getElementById('topicForm').reset();
        
        // Set default dates
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // Adjust for timezone
        now.setMinutes(0, 0, 0); // Start of hour
        const startDate = now.toISOString().slice(0, 16);
        
        const endDate = new Date(now);
        endDate.setDate(endDate.getDate() + 7);
        const endDateString = endDate.toISOString().slice(0, 16);
        
        document.getElementById('topicForm').querySelector('input[name="start_date"]').value = startDate;
        document.getElementById('topicForm').querySelector('input[name="end_date"]').value = endDateString;
        document.getElementById('imagePreview').src = '{{ asset("images/placeholder.png") }}';
        document.getElementById('topicModal').classList.remove('hidden');
    }

    function openEditModal(id, title, description, image, startDate, endDate, isActive) {
        document.getElementById('modalTitle').textContent = 'Edit Topic';
        document.getElementById('topicForm').action = `/admin/topics/${id}`;
        document.getElementById('topicForm').querySelector('input[name="_method"]').value = 'PUT';
        
        const form = document.getElementById('topicForm');
        form.querySelector('input[name="title"]').value = title;
        form.querySelector('textarea[name="description"]').value = description;
        form.querySelector('input[name="start_date"]').value = startDate;
        form.querySelector('input[name="end_date"]').value = endDate;
        form.querySelector('input[name="is_active"]').checked = isActive;
        
        if (image) {
            document.getElementById('imagePreview').src = image;
        }
        
        document.getElementById('topicModal').classList.remove('hidden');
    }

    function closeModal() {
        document.getElementById('topicModal').classList.add('hidden');
        document.getElementById('topicForm').reset();
        document.getElementById('imagePreview').src = '{{ asset("images/placeholder.png") }}';
    }

    function openDeleteModal(id) {
        document.getElementById('deleteForm').action = `/admin/topics/${id}`;
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