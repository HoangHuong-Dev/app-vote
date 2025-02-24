<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name') }}</title>

    <!-- Production Assets -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])

    <!-- Font Awesome từ build -->
    <link href="{{ asset('build/assets/app-D6zuqlHm.css') }}" rel="stylesheet">
    <script src="{{ asset('build/assets/app-BDN7j1zN.js') }}" defer></script>

    <!-- CDN Assets -->
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/alpinejs@2.8.2/dist/alpine.min.js" defer></script>
</head>
<body>
    @yield('content')
</body>
</html> 