<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\API\CountryController;
use App\Http\Controllers\API\ClubController;
use App\Http\Controllers\API\TopicController;
use App\Http\Controllers\API\VoteController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Routes không cần authentication
Route::get('/countries', [CountryController::class, 'index']);
Route::get('/countries/{country}', [CountryController::class, 'show']);
Route::get('/clubs', [ClubController::class, 'index']);
Route::get('/clubs/{club}', [ClubController::class, 'show']);
Route::get('/topics', [TopicController::class, 'index']);
Route::get('/topics/{topic}', [TopicController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Country routes (chỉ admin mới có quyền thêm/sửa/xóa)
    Route::post('/countries', [CountryController::class, 'store']);
    Route::put('/countries/{country}', [CountryController::class, 'update']);
    Route::delete('/countries/{country}', [CountryController::class, 'destroy']);

    // Club routes (chỉ admin mới có quyền thêm/sửa/xóa)
    Route::post('/clubs', [ClubController::class, 'store']);
    Route::put('/clubs/{club}', [ClubController::class, 'update']);
    Route::delete('/clubs/{club}', [ClubController::class, 'destroy']);

    // Topic routes (chỉ admin mới có quyền thêm/sửa/xóa)
    Route::post('/topics', [TopicController::class, 'store']);
    Route::put('/topics/{topic}', [TopicController::class, 'update']);
    Route::delete('/topics/{topic}', [TopicController::class, 'destroy']);

    // Vote routes (cho tất cả users đã đăng nhập)
    Route::apiResource('votes', VoteController::class);
}); 