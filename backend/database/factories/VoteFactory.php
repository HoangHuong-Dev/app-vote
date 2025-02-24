<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Topic;
use App\Models\Club;
use Illuminate\Database\Eloquent\Factories\Factory;

class VoteFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'topic_id' => Topic::factory(),
            'club_id' => Club::factory(),
            'comment' => fake()->optional()->sentence(),
            'image' => fake()->optional()->imageUrl(640, 480, 'vote'),
            'created_at' => fake()->dateTimeBetween('-1 month', 'now'),
        ];
    }
} 