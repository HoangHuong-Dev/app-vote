<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\WebAuthController;
use App\Http\Controllers\Admin\AdminCountryController;
use App\Http\Controllers\Admin\AdminClubController;
use App\Http\Controllers\Admin\AdminTopicController;
use App\Http\Controllers\Admin\AdminVoteController;
use App\Http\Controllers\Admin\CityController;

Route::get('/', function () {
    return view('welcome');
});

// Web Auth routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [WebAuthController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [WebAuthController::class, 'login'])->name('login.submit');
});
Route::post('/logout', [WebAuthController::class, 'logout'])->middleware('auth')->name('logout');

// Admin routes
Route::prefix('admin')->middleware(['auth', 'admin'])->group(function () {
    Route::get('/', [AdminController::class, 'index'])->name('admin.dashboard');
    Route::post('/logout', [AdminController::class, 'logout'])->name('admin.logout');
    
    // User management routes
    Route::get('/users', [AdminController::class, 'users'])->name('admin.users.index');
    Route::post('/users', [AdminController::class, 'store'])->name('admin.users.store');
    Route::put('/users/{id}', [AdminController::class, 'update'])->name('admin.users.update');
    Route::delete('/users/{id}', [AdminController::class, 'destroy'])->name('admin.users.destroy');
    Route::post('/users/{id}/toggle-admin', [AdminController::class, 'toggleAdmin'])->name('admin.toggle');

    // Country management routes
    Route::get('/countries', [AdminCountryController::class, 'index'])->name('admin.countries.index');
    Route::post('/countries', [AdminCountryController::class, 'store'])->name('admin.countries.store');
    Route::put('/countries/{country}', [AdminCountryController::class, 'update'])->name('admin.countries.update');
    Route::delete('/countries/{country}', [AdminCountryController::class, 'destroy'])->name('admin.countries.destroy');

    // Club management routes
    Route::get('/clubs', [AdminClubController::class, 'index'])->name('admin.clubs.index');
    Route::post('/clubs', [AdminClubController::class, 'store'])->name('admin.clubs.store');
    Route::put('/clubs/{club}', [AdminClubController::class, 'update'])->name('admin.clubs.update');
    Route::delete('/clubs/{club}', [AdminClubController::class, 'destroy'])->name('admin.clubs.destroy');
    Route::get('/countries/{country}/cities', [AdminClubController::class, 'getCitiesByCountry'])->name('admin.countries.cities');

    // Topic management routes
    Route::get('/topics', [AdminTopicController::class, 'index'])->name('admin.topics.index');
    Route::post('/topics', [AdminTopicController::class, 'store'])->name('admin.topics.store');
    Route::put('/topics/{topic}', [AdminTopicController::class, 'update'])->name('admin.topics.update');
    Route::delete('/topics/{topic}', [AdminTopicController::class, 'destroy'])->name('admin.topics.destroy');
    Route::get('/topics/{topic}/stats', [AdminTopicController::class, 'showStats'])->name('admin.topics.stats');
    Route::post('/topics/{topic}/toggle-status', [AdminTopicController::class, 'toggleStatus'])->name('admin.topics.toggle-status');

    // Vote management routes
    Route::get('/votes', [AdminVoteController::class, 'index'])->name('admin.votes.index');
    Route::get('/votes/{vote}', [AdminVoteController::class, 'show'])->name('admin.votes.show');
    Route::delete('/votes/{vote}', [AdminVoteController::class, 'destroy'])->name('admin.votes.destroy');

    // City management routes
    Route::resource('cities', CityController::class)->names('admin.cities');
});
