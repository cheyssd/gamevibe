<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_un_utilisateur_peut_s_inscrire(): void
    {
        $response = $this->postJson('/api/register', [
            'nom' => 'Konan',
            'email' => 'konan@gamevibe.com',
            'mot_de_passe' => 'password123',
            'mot_de_passe_confirmation' => 'password123',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['message', 'user', 'token']);

        $this->assertDatabaseHas('users', [
            'email' => 'konan@gamevibe.com',
            'role' => 'user',
        ]);
    }

    public function test_l_inscription_echoue_avec_un_email_deja_pris(): void
    {
        User::factory()->create(['email' => 'konan@gamevibe.com']);

        $response = $this->postJson('/api/register', [
            'nom' => 'Konan',
            'email' => 'konan@gamevibe.com',
            'mot_de_passe' => 'password123',
            'mot_de_passe_confirmation' => 'password123',
        ]);

        $response->assertStatus(422);
    }

    public function test_l_inscription_echoue_si_mots_de_passe_ne_correspondent_pas(): void
    {
        $response = $this->postJson('/api/register', [ 
            'nom' => 'Konan',
            'email' => 'konan@gamevibe.com',
            'mot_de_passe' => 'password123',
            'mot_de_passe_confirmation' => 'autrepassword',
        ]);

        $response->assertStatus(422);
    }

    public function test_un_utilisateur_peut_se_connecter(): void
    {
        $user = User::factory()->create([
            'email' => 'konan@gamevibe.com',
            'password' => Hash::make('password123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'konan@gamevibe.com',
            'mot_de_passe' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['message', 'user', 'token']);
    }

    public function test_la_connexion_echoue_avec_mauvais_mot_de_passe(): void
    {
        User::factory()->create([
            'email' => 'konan@gamevibe.com',
            'password' => Hash::make('password123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'konan@gamevibe.com',
            'mot_de_passe' => 'mauvaispassword',
        ]);

        $response->assertStatus(401);
    }

    public function test_la_connexion_echoue_avec_email_inexistant(): void
    {
        $response = $this->postJson('/api/login', [
            'email' => 'inexistant@gamevibe.com',
            'mot_de_passe' => 'password123',
        ]);

        $response->assertStatus(401);
    }

    public function test_un_utilisateur_connecte_peut_se_deconnecter(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/logout');

        $response->assertStatus(200);
    }

    public function test_un_utilisateur_non_connecte_ne_peut_pas_se_deconnecter(): void
    {
        $response = $this->postJson('/api/logout');

        $response->assertStatus(401);
    }
}
