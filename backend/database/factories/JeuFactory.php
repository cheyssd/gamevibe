<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class JeuFactory extends Factory
{
    public function definition(): array
    {
        return [
            'titre' => fake()->words(3, true),
            'description' => fake()->paragraph(),
            'image' => fake()->imageUrl(400, 250, 'games'),
            'date_sortie' => fake()->date(),
            'note_moyenne' => 0,
        ];
    }
}
