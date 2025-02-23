<?php

namespace Database\Factories;

use App\Models\Country;
use Illuminate\Database\Eloquent\Factories\Factory;

class ClubFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->company(),
            'logo' => fake()->imageUrl(200, 200, 'logo'),
            'country_id' => Country::factory(),
            'description' => fake()->paragraph(),
        ];
    }
} 