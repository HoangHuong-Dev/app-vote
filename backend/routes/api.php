<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CountryController;
use App\Http\Controllers\Api\ClubController;
use App\Http\Controllers\Api\TopicController;
use App\Http\Controllers\Api\VoteController;
use App\Http\Controllers\Api\RankingController;
use App\Http\Controllers\Api\CityController;
use App\Http\Controllers\Api\EmailVerificationController;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Mail\VerificationEmail;

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

    // Rankings routes (yêu cầu đăng nhập)
    Route::get('/rankings/clubs', [RankingController::class, 'getClubRankings']);
    Route::get('/rankings/countries', [RankingController::class, 'getCountryRankings']);
    Route::get('/rankings/cities', [RankingController::class, 'getCityRankings']);
    Route::get('/clubs/search', [RankingController::class, 'searchClubs']);

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

// Email verification routes
Route::post('verify-email', [EmailVerificationController::class, 'verify']);
Route::post('resend-verification', [EmailVerificationController::class, 'resend']);

// Test email route
Route::get('test-email', function() {
    try {
        $testEmail = request()->query('email', 'test@example.com');
        Log::info('Attempting to send test email', ['email' => $testEmail]);
        
        Mail::to($testEmail)->send(new VerificationEmail('Test User', '123456'));
        
        Log::info('Test email sent successfully');
        return response()->json(['message' => 'Test email sent successfully']);
    } catch (\Exception $e) {
        Log::error('Test email failed', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);
        return response()->json([
            'message' => 'Failed to send test email',
            'error' => $e->getMessage()
        ], 500);
    }
});
