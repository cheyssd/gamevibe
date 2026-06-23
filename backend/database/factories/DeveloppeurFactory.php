<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class DeveloppeurFactory extends Factory
{
    public function definition(): array
    {
        return [
            'nom' => fake()->company(),
        ];
    }
}
