@extends('admin.layouts.app')

@section('content')
<div class="flex-1">
    <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto py-6 px-4">
            <div class="flex justify-between items-center">
                <h2 class="text-3xl font-bold text-gray-800">Topic Statistics: {{ $topic->title }}</h2>
                <a href="{{ route('admin.topics.index') }}" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                    <i class="fas fa-arrow-left mr-2"></i>Back to Topics
                </a>
            </div>
        </div>
    </header>

    <main class="max-w-7xl mx-auto py-6 px-4">
        <!-- Topic Info -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <h3 class="text-lg font-semibold mb-2">Topic Details</h3>
                    <p><span class="font-medium">Status:</span> 
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {{ $topic->is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800' }}">
                            {{ $topic->is_active ? 'Active' : 'Inactive' }}
                        </span>
                    </p>
                    <p><span class="font-medium">Period:</span> {{ $topic->start_date->format('Y-m-d H:i') }} - {{ $topic->end_date->format('Y-m-d H:i') }}</p>
                    <p><span class="font-medium">Total Votes:</span> {{ $voteStats->sum('vote_count') }}</p>
                </div>
                <div>
                    <h3 class="text-lg font-semibold mb-2">Description</h3>
                    <p>{{ $topic->description }}</p>
                </div>
            </div>
        </div>

        <!-- Vote Statistics -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-semibold">Voting Results</h3>
            </div>
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Club</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Votes</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    @foreach($voteStats as $index => $stat)
                    <tr class="hover:bg-gray-50">
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ $index + 1 }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                                <div class="flex-shrink-0 h-10 w-10">
                                    @if($stat->club->logo)
                                        <img class="h-10 w-10 rounded-full object-cover" src="{{ $stat->club->logo }}" alt="{{ $stat->club->name }}">
                                    @else
                                        <div class="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                            <i class="fas fa-futbol text-gray-500"></i>
                                        </div>
                                    @endif
                                </div>
                                <div class="ml-4">
                                    <div class="text-sm font-medium text-gray-900">{{ $stat->club->name }}</div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ $stat->club->country->name }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ $stat->vote_count }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                                <div class="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                                    <div class="bg-blue-600 h-2.5 rounded-full" style="width: {{ ($stat->vote_count / $voteStats->sum('vote_count')) * 100 }}%"></div>
                                </div>
                                <span class="text-sm text-gray-500">{{ number_format(($stat->vote_count / $voteStats->sum('vote_count')) * 100, 1) }}%</span>
                            </div>
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </main>
</div>
@endsection 