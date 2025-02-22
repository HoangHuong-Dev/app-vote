<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;

Route::get('/', function () {
    return view('welcome');
});

// Admin routes
Route::prefix('admin')->group(function () {
    // Guest routes
    Route::middleware('guest')->group(function () {
        Route::get('/login', [AdminController::class, 'showLoginForm'])->name('admin.login');
        Route::post('/login', [AdminController::class, 'login'])->name('admin.login.submit');
    });

    // Protected routes
    Route::middleware(['auth', 'admin'])->group(function () {
        Route::get('/', [AdminController::class, 'index'])->name('admin.dashboard');
        Route::post('/logout', [AdminController::class, 'logout'])->name('admin.logout');
        Route::post('/users/{id}/toggle-admin', [AdminController::class, 'toggleAdmin'])->name('admin.toggle');
        
        // CRUD routes for users
        Route::post('/users', [AdminController::class, 'store'])->name('admin.users.store');
        Route::put('/users/{id}', [AdminController::class, 'update'])->name('admin.users.update');
        Route::delete('/users/{id}', [AdminController::class, 'destroy'])->name('admin.users.destroy');
    });
});
