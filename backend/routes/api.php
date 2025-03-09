<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\API\CountryController;
use App\Http\Controllers\API\ClubController;
use App\Http\Controllers\API\TopicController;
use App\Http\Controllers\API\VoteController;
use App\Http\Controllers\API\RankingController;
use App\Http\Controllers\API\CityController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Routes không cần authentication
Route::get('/countries', [CountryController::class, 'index']);
Route::get('/countries/{country}', [CountryController::class, 'show']);
Route::get('/cities', [CityController::class, 'index']);
Route::get('/cities/{city}', [CityController::class, 'show']);
Route::get('/countries/{country}/cities', [CityController::class, 'getCitiesByCountry']);
Route::get('/clubs', [ClubController::class, 'index']);
Route::get('/clubs/{club}', [ClubController::class, 'show']);
Route::get('/topics', [TopicController::class, 'index']);
Route::get('/topics/{topic}', [TopicController::class, 'show']);
Route::get('/rankings/country/{country}', [RankingController::class, 'getClubRankingsByCountry']);
Route::get('/rankings/city/{city}', [RankingController::class, 'getClubRankingsByCity']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Country routes (chỉ admin mới có quyền thêm/sửa/xóa)
    Route::post('/countries', [CountryController::class, 'store']);
    Route::put('/countries/{country}', [CountryController::class, 'update']);
    Route::delete('/countries/{country}', [CountryController::class, 'destroy']);

    // City routes (chỉ admin mới có quyền thêm/sửa/xóa)
    Route::post('/cities', [CityController::class, 'store']);
    Route::put('/cities/{city}', [CityController::class, 'update']);
    Route::delete('/cities/{city}', [CityController::class, 'destroy']);

    // Club routes (chỉ admin mới có quyền thêm/sửa/xóa)
    Route::post('/clubs', [ClubController::class, 'store']);
    Route::put('/clubs/{club}', [ClubController::class, 'update']);
    Route::delete('/clubs/{club}', [ClubController::class, 'destroy']);

    // Topic routes (chỉ admin mới có quyền thêm/sửa/xóa)
    Route::post('/topics', [TopicController::class, 'store']);
    Route::put('/topics/{topic}', [TopicController::class, 'update']);
    Route::delete('/topics/{topic}', [TopicController::class, 'destroy']);

    // Vote routes (yêu cầu đăng nhập)
    Route::post('/votes', [VoteController::class, 'store']);
    Route::get('/votes', [VoteController::class, 'index']);
    Route::get('/votes/{vote}', [VoteController::class, 'show']);
    Route::put('/votes/{vote}', [VoteController::class, 'update']);
    Route::delete('/votes/{vote}', [VoteController::class, 'destroy']);
}); 