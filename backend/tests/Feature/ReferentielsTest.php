<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Categorie;
use App\Models\Plateforme;
use App\Models\Developpeur;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ReferentielsTest extends TestCase
{
    use RefreshDatabase;

    private function adminToken(): string
    {
        $admin = User::factory()->create(['role' => 'admin']);
        return $admin->createToken('test')->plainTextToken;
    }

    // ===== CATÉGORIES =====

    public function test_n_importe_qui_peut_voir_les_categories(): void
    {
        Categorie::factory()->count(3)->create();

        $response = $this->getJson('/api/categories');

        $response->assertStatus(200);
        $this->assertCount(3, $response->json('data'));
    }

    public function test_un_admin_peut_ajouter_une_categorie(): void
    {
        $token = $this->adminToken();

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/categories', ['nom' => 'RPG']);

        $response->assertStatus(201);
        $this->assertDatabaseHas('categories', ['nom' => 'RPG']);
    }

    public function test_on_ne_peut_pas_ajouter_deux_categories_avec_le_meme_nom(): void
    {
        Categorie::factory()->create(['nom' => 'RPG']);
        $token = $this->adminToken();

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/categories', ['nom' => 'RPG']);

        $response->assertStatus(422);
    }

    public function test_un_user_normal_ne_peut_pas_ajouter_de_categorie(): void
    {
        $user = User::factory()->create(['role' => 'user']);
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/categories', ['nom' => 'RPG']);

        $response->assertStatus(403);
    }

    public function test_un_admin_peut_supprimer_une_categorie(): void
    {
        $categorie = Categorie::factory()->create();
        $token = $this->adminToken();

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->deleteJson("/api/categories/{$categorie->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('categories', ['id' => $categorie->id]);
    }

    // ===== PLATEFORMES =====

    public function test_n_importe_qui_peut_voir_les_plateformes(): void
    {
        Plateforme::factory()->count(2)->create();

        $response = $this->getJson('/api/plateformes');

        $response->assertStatus(200);
        $this->assertCount(2, $response->json('data'));
    }

    public function test_un_admin_peut_ajouter_une_plateforme(): void
    {
        $token = $this->adminToken();

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/plateformes', ['nom' => 'PS5']);

        $response->assertStatus(201);
        $this->assertDatabaseHas('plateformes', ['nom' => 'PS5']);
    }

    public function test_un_admin_peut_modifier_une_plateforme(): void
    {
        $plateforme = Plateforme::factory()->create(['nom' => 'PS4']);
        $token = $this->adminToken();

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->putJson("/api/plateformes/{$plateforme->id}", ['nom' => 'PS5']);

        $response->assertStatus(200);
        $this->assertDatabaseHas('plateformes', ['id' => $plateforme->id, 'nom' => 'PS5']);
    }

    // ===== DÉVELOPPEURS =====

    public function test_n_importe_qui_peut_voir_les_developpeurs(): void
    {
        Developpeur::factory()->count(2)->create();

        $response = $this->getJson('/api/developpeurs');

        $response->assertStatus(200);
        $this->assertCount(2, $response->json('data'));
    }

    public function test_un_admin_peut_ajouter_un_developpeur(): void
    {
        $token = $this->adminToken();

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/developpeurs', ['nom' => 'FromSoftware']);

        $response->assertStatus(201);
        $this->assertDatabaseHas('developpeurs', ['nom' => 'FromSoftware']);
    }

    public function test_un_admin_peut_supprimer_un_developpeur(): void
    {
        $developpeur = Developpeur::factory()->create();
        $token = $this->adminToken();

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->deleteJson("/api/developpeurs/{$developpeur->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('developpeurs', ['id' => $developpeur->id]);
    }
}
