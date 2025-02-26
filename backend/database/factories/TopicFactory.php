<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Country;
use App\Models\Topic;

class TopicFactory extends Factory
{
    public function definition(): array
    {
        $startDate = fake()->dateTimeBetween('now', '+1 month');
        $endDate = fake()->dateTimeBetween($startDate, '+2 months');
        
        return [
            'title' => fake()->sentence(),
            'description' => fake()->paragraph(),
            'image' => '/uploads/demodemo01.png',
            'start_date' => $startDate,
            'end_date' => $endDate,
            'is_active' => true,
        ];
    }

    public function withCountries($count = 3)
    {
        return $this->afterCreating(function (Topic $topic) use ($count) {
            $topic->countries()->attach(
                Country::factory()->count($count)->create()->pluck('id')
            );
        });
    }
} 