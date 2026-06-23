<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class AvisFactory extends Factory
{
    public function definition(): array
    {
        return [
            'note' => fake()->numberBetween(1, 5),
            'commentaire' => fake()->paragraph(),
        ];
    }
}
