<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CountryFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->country(),
            'code' => fake()->countryCode(),
            'flag' => fake()->imageUrl(640, 480, 'flag'),
        ];
    }
} 