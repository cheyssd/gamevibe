<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Jeu;
use App\Models\Developpeur;
use App\Models\Plateforme;
use App\Models\Categorie;
use Illuminate\Foundation\Testing\RefreshDatabase;

class JeuTest extends TestCase
{
    use RefreshDatabase;

    public function test_n_importe_qui_peut_voir_la_liste_des_jeux(): void
    {
        $developpeur = Developpeur::factory()->create();
        Jeu::factory()->count(3)->create(['developpeur_id' => $developpeur->id]);

        $response = $this->getJson('/api/jeux');

        $response->assertStatus(200)
            ->assertJsonStructure(['data', 'meta']);
    }

    public function test_n_importe_qui_peut_voir_la_fiche_d_un_jeu(): void
    {
        $developpeur = Developpeur::factory()->create();
        $jeu = Jeu::factory()->create(['developpeur_id' => $developpeur->id]);

        $response = $this->getJson("/api/jeux/{$jeu->uuid}");

        $response->assertStatus(200)
            ->assertJsonPath('data.id', $jeu->uuid)
            ->assertJsonPath('data.titre', $jeu->titre);
    }

    public function test_la_recherche_de_jeu_par_titre_fonctionne(): void
    {
        $developpeur = Developpeur::factory()->create();
        Jeu::factory()->create(['developpeur_id' => $developpeur->id, 'titre' => 'Elden Ring']);
        Jeu::factory()->create(['developpeur_id' => $developpeur->id, 'titre' => 'EA FC 25']);

        $response = $this->getJson('/api/jeux?search=Elden');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
    }

    public function test_un_admin_peut_ajouter_un_jeu(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $developpeur = Developpeur::factory()->create();
        $plateforme = Plateforme::factory()->create();
        $categorie = Categorie::factory()->create();
        $token = $admin->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/jeux', [
                'titre' => 'Elden Ring',
                'description' => 'Un RPG en monde ouvert',
                'date_sortie' => '2022-02-25',
                'developpeur_id' => $developpeur->uuid,
                'plateformes' => [$plateforme->uuid],
                'categories' => [$categorie->uuid],
            ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('jeux', ['titre' => 'Elden Ring']);
    }

    public function test_un_user_normal_ne_peut_pas_ajouter_un_jeu(): void
    {
        $user = User::factory()->create(['role' => 'user']);
        $developpeur = Developpeur::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/jeux', [
                'titre' => 'Elden Ring',
                'description' => 'Un RPG en monde ouvert',
                'date_sortie' => '2022-02-25',
                'developpeur_id' => $developpeur->id,
                'plateformes' => [],
                'categories' => [],
            ]);

        $response->assertStatus(403);
    }

    public function test_un_visiteur_non_connecte_ne_peut_pas_ajouter_un_jeu(): void
    {
        $developpeur = Developpeur::factory()->create();

        $response = $this->postJson('/api/jeux', [
            'titre' => 'Elden Ring',
            'description' => 'Un RPG en monde ouvert',
            'date_sortie' => '2022-02-25',
            'developpeur_id' => $developpeur->id,
        ]);

        $response->assertStatus(401);
    }

    public function test_un_admin_peut_modifier_un_jeu(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $developpeur = Developpeur::factory()->create();
        $jeu = Jeu::factory()->create(['developpeur_id' => $developpeur->id, 'titre' => 'Ancien titre']);
        $token = $admin->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->putJson("/api/jeux/{$jeu->uuid}", [
                'titre' => 'Nouveau titre',
            ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('jeux', ['id' => $jeu->id, 'titre' => 'Nouveau titre']);
    }

    public function test_un_admin_peut_supprimer_un_jeu(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $developpeur = Developpeur::factory()->create();
        $jeu = Jeu::factory()->create(['developpeur_id' => $developpeur->id]);
        $token = $admin->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->deleteJson("/api/jeux/{$jeu->uuid}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('jeux', ['id' => $jeu->id]);
    }
}
