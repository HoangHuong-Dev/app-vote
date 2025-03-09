<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Vote;
use App\Models\Club;
use App\Models\UserTopic;
use App\Mail\VerificationEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class EmailVerificationController extends Controller
{
    public function verify(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'code' => 'required|string'
        ]);

        $user = User::where('email', $request->email)
            ->where('verification_code', $request->code)
            ->first();

        if (!$user) {
            return response()->json([
                'message' => 'Invalid verification code'
            ], 400);
        }

        if ($user->email_verified_at) {
            return response()->json([
                'message' => 'Email already verified'
            ], 400);
        }

        DB::beginTransaction();
        try {
            // Update user verification status
            $user->email_verified_at = Carbon::now();
            $user->verification_code = null;
            $user->save();

            // Get temporary vote info from user_topics
            $userTopic = UserTopic::where('user_id', $user->id)->first();
            if ($userTopic) {
                // Create vote
                $vote = Vote::create([
                    'user_id' => $user->id,
                    'topic_id' => $userTopic->topic_id,
                    'club_id' => $userTopic->club_id
                ]);

                // Increment vote count
                Club::where('id', $userTopic->club_id)->increment('votes_count');

                // Delete temporary data
                $userTopic->delete();

                Log::info('Vote created after email verification', [
                    'user_id' => $user->id,
                    'vote_id' => $vote->id
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Email verified successfully'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Email verification failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Email verification failed. Please try again.'
            ], 500);
        }
    }

    public function resend(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email'
        ]);

        $user = User::where('email', $request->email)->first();

        if ($user->email_verified_at) {
            return response()->json([
                'message' => 'Email already verified'
            ], 400);
        }

        // Generate new verification code
        $verificationCode = mt_rand(100000, 999999);
        $user->verification_code = $verificationCode;
        $user->save();

        try {
            Log::info('Attempting to resend verification email', [
                'email' => $user->email,
                'name' => $user->name
            ]);

            Mail::to($user->email)->send(new VerificationEmail($user->name, $verificationCode));
            
            Log::info('Verification email resent successfully');
            
            return response()->json([
                'message' => 'Verification code sent successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to send verification email', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Failed to send verification code'
            ], 500);
        }
    }
} 