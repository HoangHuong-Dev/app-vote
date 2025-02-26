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
            'logo' => '/uploads/demodemo01.png',
            'image' => '/uploads/demodemo01.png',
            'country_id' => Country::factory(),
            'description' => fake()->paragraph(),
        ];
    }
} 