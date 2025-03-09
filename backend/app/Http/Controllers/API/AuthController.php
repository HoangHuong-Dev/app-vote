<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserTopic;
use App\Mail\VerificationEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Kiểm tra xem email đã được xác thực chưa
        if (!$user->email_verified_at) {
            return response()->json([
                'message' => 'Please verify your email first.',
                'email' => $user->email,
                'need_verification' => true
            ], 403);
        }

        // Tạo token mới và xóa các token cũ
        $user->tokens()->delete();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_admin' => $user->is_admin,
                'is_active' => $user->is_active,
                'email_verified_at' => $user->email_verified_at
            ]
        ]);
    }

    public function logout(Request $request)
    {
        // Xóa token hiện tại
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Successfully logged out'
        ]);
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'topic_id' => 'required|exists:topics,id',
            'country_id' => 'required|exists:countries,id',
            'club_id' => 'required|exists:clubs,id'
        ]);

        // Generate verification code
        $verificationCode = mt_rand(100000, 999999);

        Log::info('Starting user registration process', [
            'email' => $request->email,
            'verification_code' => $verificationCode
        ]);

        DB::beginTransaction();
        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'verification_code' => $verificationCode
            ]);

            Log::info('User created successfully', ['user_id' => $user->id]);

            // Store temporary vote info in user_topics
            UserTopic::create([
                'user_id' => $user->id,
                'topic_id' => $request->topic_id,
                'country_id' => $request->country_id,
                'club_id' => $request->club_id
            ]);

            Log::info('User topic created successfully');

            // Send verification email
            Mail::to($user->email)->send(new VerificationEmail($user->name, $verificationCode));
            Log::info('Verification email sent successfully');

            DB::commit();

            return response()->json([
                'message' => 'Registration successful. Please check your email for verification code.',
                'email' => $user->email
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Registration failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Registration failed. Please try again.'
            ], 500);
        }
    }
} 