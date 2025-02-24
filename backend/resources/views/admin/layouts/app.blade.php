<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
    
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    
    <!-- DataTables CSS -->
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.7/css/jquery.dataTables.min.css">
    <link rel="stylesheet" href="https://cdn.datatables.net/responsive/2.5.0/css/responsive.dataTables.min.css">
    
    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    
    <!-- DataTables JS -->
    <script src="https://cdn.datatables.net/1.13.7/js/jquery.dataTables.min.js"></script>
    <script src="https://cdn.datatables.net/responsive/2.5.0/js/dataTables.responsive.min.js"></script>
    
    @yield('styles')
</head>
<body class="bg-gray-100">
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
                    <a href="{{ route('admin.users.index') }}" class="block py-3 px-4 rounded transition duration-200 hover:bg-gray-700 mb-2">
                        <i class="fas fa-users mr-3"></i>
                        Users
                    </a>
                    <a href="{{ route('admin.countries.index') }}" class="block py-3 px-4 rounded transition duration-200 hover:bg-gray-700 mb-2">
                        <i class="fas fa-globe mr-3"></i>
                        Countries
                    </a>
                    <a href="{{ route('admin.clubs.index') }}" class="block py-3 px-4 rounded transition duration-200 hover:bg-gray-700 mb-2">
                        <i class="fas fa-futbol mr-3"></i>
                        Clubs
                    </a>
                    <a href="{{ route('admin.topics.index') }}" class="block py-3 px-4 rounded transition duration-200 hover:bg-gray-700 mb-2">
                        <i class="fas fa-list mr-3"></i>
                        Topics
                    </a>
                    <a href="{{ route('admin.votes.index') }}" class="block py-3 px-4 rounded transition duration-200 hover:bg-gray-700 mb-2">
                        <i class="fas fa-vote-yea mr-3"></i>
                        Votes
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
        @yield('content')
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/js/all.min.js"></script>
    @yield('scripts')
    <script>
        $(document).ready(function() {
            $('.datatable').DataTable({
                responsive: true,
                pageLength: 10,
                order: [[0, 'desc']],
                language: {
                    search: '<i class="fas fa-search"></i>',
                    searchPlaceholder: "Search...",
                    lengthMenu: "Show _MENU_ entries per page",
                    info: "Showing _START_ to _END_ of _TOTAL_ entries",
                    infoEmpty: "Showing 0 to 0 of 0 entries",
                    infoFiltered: "(filtered from _MAX_ total entries)",
                    paginate: {
                        first: '<i class="fas fa-angle-double-left"></i>',
                        previous: '<i class="fas fa-angle-left"></i>',
                        next: '<i class="fas fa-angle-right"></i>',
                        last: '<i class="fas fa-angle-double-right"></i>'
                    },
                    emptyTable: "No data available",
                    zeroRecords: "No matching records found"
                },
                dom: "<'flex items-center justify-between mb-4'<'flex items-center'l><'flex items-center'f>>" +
                     "rt" +
                     "<'flex items-center justify-between mt-4'<'flex items-center'i><'flex items-center'p>>",
                drawCallback: function() {
                    $('.dataTables_length select').addClass('rounded border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50');
                    $('.dataTables_filter input').addClass('rounded border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50');
                    $('.dataTables_info').addClass('text-gray-600');
                    $('.paginate_button').addClass('px-3 py-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50');
                    $('.paginate_button.current').addClass('bg-blue-50 text-blue-600 border-blue-500');
                    $('.paginate_button.disabled').addClass('opacity-50 cursor-not-allowed');
                }
            });
        });
    </script>
</body>
</html> 