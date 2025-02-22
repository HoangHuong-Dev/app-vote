<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Dashboard</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
        <style>
            /* Custom switch styling */
            .switch {
                position: relative;
                display: inline-block;
                width: 48px;
                height: 24px;
            }
            .switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            .slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                transition: .4s;
                border-radius: 24px;
            }
            .slider:before {
                position: absolute;
                content: "";
                height: 18px;
                width: 18px;
                left: 3px;
                bottom: 3px;
                background-color: white;
                transition: .4s;
                border-radius: 50%;
            }
            input:checked + .slider {
                background-color: #10B981;
            }
            input:checked + .slider:before {
                transform: translateX(24px);
            }
        </style>
    </head>
    <body class="bg-gray-100">
        <!-- Create/Edit User Modal -->
        <div id="userModal" class="fixed z-10 inset-0 overflow-y-auto hidden">
            <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div class="fixed inset-0 transition-opacity">
                    <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <form id="userForm" method="POST" action="{{ route('admin.users.store') }}">
                        @csrf
                        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <h3 class="text-lg font-medium text-gray-900" id="modalTitle">Create New User</h3>
                            <div class="mt-4">
                                <input type="hidden" name="_method" value="POST">
                                <div class="mb-4">
                                    <label class="block text-gray-700 text-sm font-bold mb-2">Name</label>
                                    <input type="text" name="name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                </div>
                                <div class="mb-4">
                                    <label class="block text-gray-700 text-sm font-bold mb-2">Email</label>
                                    <input type="email" name="email" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                </div>
                                <div class="mb-4">
                                    <label class="block text-gray-700 text-sm font-bold mb-2">Password</label>
                                    <input type="password" name="password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                </div>
                                <div class="mb-4">
                                    <label class="block text-gray-700 text-sm font-bold mb-2">Admin Status</label>
                                    <select name="is_admin" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                        <option value="0">Regular User</option>
                                        <option value="1">Admin</option>
                                    </select>
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
                        <p class="mt-2 text-sm text-gray-500">Are you sure you want to delete this user? This action cannot be undone.</p>
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

        <div class="min-h-screen flex">
            <!-- Sidebar -->
            <div class="bg-gray-800 text-white w-64 py-6 flex-shrink-0">
                <div class="px-6">
                    <div class="flex items-center justify-center mb-8">
                        <i class="fas fa-shield-alt text-4xl text-blue-400 mr-3"></i>
                        <h1 class="text-2xl font-bold">Admin Panel</h1>
                    </div>
                    <nav>
                        <a href="/" class="block py-3 px-4 rounded transition duration-200 hover:bg-gray-700 mb-2">
                            <i class="fas fa-home mr-3"></i>
                            Back to Home
                        </a>
                        <a href="/admin" class="block py-3 px-4 rounded bg-gray-700 transition duration-200 hover:bg-gray-600 mb-2">
                            <i class="fas fa-users mr-3"></i>
                            Users
                        </a>
                        <form action="{{ route('admin.logout') }}" method="POST" class="mt-4">
                            @csrf
                            <button type="submit" class="w-full text-left block py-3 px-4 rounded transition duration-200 hover:bg-red-600 mb-2">
                                <i class="fas fa-sign-out-alt mr-3"></i>
                                Logout
                            </button>
                        </form>
                    </nav>
                </div>
            </div>

            <!-- Main Content -->
            <div class="flex-1">
                <!-- Header -->
                <header class="bg-white shadow">
                    <div class="max-w-7xl mx-auto py-6 px-4">
                        <div class="flex justify-between items-center">
                            <h2 class="text-3xl font-bold text-gray-800">User Management</h2>
                            <button onclick="openCreateModal()" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                <i class="fas fa-plus mr-2"></i>Add New User
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
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Admin
                                    </th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                @foreach($users as $user)
                                <tr class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {{ $user->id }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex items-center">
                                            <div class="flex-shrink-0 h-10 w-10">
                                                <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <i class="fas fa-user text-blue-500"></i>
                                                </div>
                                            </div>
                                            <div class="ml-4">
                                                <div class="text-sm font-medium text-gray-900">
                                                    {{ $user->name }}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {{ $user->email }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        @if($user->id !== Auth::id())
                                            <form action="{{ route('admin.toggle', $user->id) }}" method="POST" class="inline">
                                                @csrf
                                                <label class="switch">
                                                    <input type="checkbox" {{ $user->is_admin ? 'checked' : '' }} onchange="this.form.submit()">
                                                    <span class="slider"></span>
                                                </label>
                                            </form>
                                        @else
                                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                Current Admin
                                            </span>
                                        @endif
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                                        <div class="flex space-x-3">
                                            <button onclick="openEditModal({{ $user->id }}, '{{ $user->name }}', '{{ $user->email }}', {{ $user->is_admin }})" class="text-blue-600 hover:text-blue-900">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            @if($user->id !== Auth::id())
                                                <button onclick="openDeleteModal({{ $user->id }})" class="text-red-600 hover:text-red-900">
                                                    <i class="fas fa-trash"></i>
                                                </button>
                                            @endif
                                        </div>
                                    </td>
                                </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/js/all.min.js"></script>
        <script>
            function openCreateModal() {
                document.getElementById('modalTitle').textContent = 'Create New User';
                document.getElementById('userForm').action = '{{ route("admin.users.store") }}';
                document.getElementById('userForm').querySelector('input[name="_method"]').value = 'POST';
                document.getElementById('userForm').reset();
                document.getElementById('userModal').classList.remove('hidden');
            }

            function openEditModal(id, name, email, isAdmin) {
                document.getElementById('modalTitle').textContent = 'Edit User';
                document.getElementById('userForm').action = `/admin/users/${id}`;
                document.getElementById('userForm').querySelector('input[name="_method"]').value = 'PUT';
                
                const form = document.getElementById('userForm');
                form.querySelector('input[name="name"]').value = name;
                form.querySelector('input[name="email"]').value = email;
                form.querySelector('select[name="is_admin"]').value = isAdmin ? "1" : "0";
                form.querySelector('input[name="password"]').required = false;
                
                document.getElementById('userModal').classList.remove('hidden');
            }

            function closeModal() {
                document.getElementById('userModal').classList.add('hidden');
                document.getElementById('userForm').reset();
            }

            function openDeleteModal(id) {
                document.getElementById('deleteForm').action = `/admin/users/${id}`;
                document.getElementById('deleteModal').classList.remove('hidden');
            }

            function closeDeleteModal() {
                document.getElementById('deleteModal').classList.add('hidden');
            }
        </script>
    </body>
</html>
