<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class PlateformeFactory extends Factory
{
    public function definition(): array
    {
        return [
            'nom' => fake()->randomElement(['PC', 'PS5', 'Xbox', 'Switch']),
        ];
    }
}
