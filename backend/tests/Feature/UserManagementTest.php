<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Jeu;
use App\Models\Avis;
use App\Models\Developpeur;
use App\Models\Categorie;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

class UserManagementTest extends TestCase
{
    use RefreshDatabase;

    // ===== GESTION ADMIN DES USERS =====

    public function test_un_admin_peut_voir_la_liste_des_users(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        User::factory()->count(3)->create();
        $token = $admin->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/users');

        $response->assertStatus(200);
    }

    public function test_un_user_normal_ne_peut_pas_voir_la_liste_des_users(): void
    {
        $user = User::factory()->create(['role' => 'user']);
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/users');

        $response->assertStatus(403);
    }

    public function test_un_admin_peut_desactiver_un_compte(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create();
        $token = $admin->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->deleteJson("/api/users/{$user->uuid}");

        $response->assertStatus(200);
        $this->assertSoftDeleted('users', ['id' => $user->id]);
    }

    public function test_un_visiteur_non_connecte_ne_peut_pas_voir_les_users(): void
    {
        $response = $this->getJson('/api/users');

        $response->assertStatus(401);
    }

    // ===== PROFIL UTILISATEUR =====

    public function test_un_user_connecte_peut_modifier_son_profil(): void
    {
        $user = User::factory()->create(['name' => 'Ancien nom']);
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->putJson('/api/profile', [
                'nom' => 'Nouveau nom',
                'email' => $user->email,
            ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('users', ['id' => $user->id, 'name' => 'Nouveau nom']);
    }

    public function test_un_user_connecte_peut_changer_son_mot_de_passe(): void
    {
        $user = User::factory()->create(['password' => Hash::make('ancienpassword')]);
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->putJson('/api/password', [
                'ancien_mot_de_passe' => 'ancienpassword',
                'nouveau_mot_de_passe' => 'nouveaupassword123',
            ]);

        $response->assertStatus(200);
        $this->assertTrue(Hash::check('nouveaupassword123', $user->fresh()->password));
    }

    public function test_le_changement_de_mot_de_passe_echoue_avec_ancien_mot_de_passe_incorrect(): void
    {
        $user = User::factory()->create(['password' => Hash::make('ancienpassword')]);
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->putJson('/api/password', [
                'ancien_mot_de_passe' => 'mauvaispassword',
                'nouveau_mot_de_passe' => 'nouveaupassword123',
            ]);

        $response->assertStatus(401);
    }

    // ===== MES AVIS / MES STATS =====

    public function test_un_user_peut_voir_ses_propres_avis(): void
    {
        $user = User::factory()->create();
        $developpeur = Developpeur::factory()->create();
        $jeu = Jeu::factory()->create(['developpeur_id' => $developpeur->id]);
        Avis::factory()->create(['user_id' => $user->id, 'jeu_id' => $jeu->id]);
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/mes-avis');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
    }

    public function test_un_user_peut_voir_ses_statistiques(): void
    {
        $user = User::factory()->create();
        $developpeur = Developpeur::factory()->create();
        $jeu = Jeu::factory()->create(['developpeur_id' => $developpeur->id]);
        Avis::factory()->create(['user_id' => $user->id, 'jeu_id' => $jeu->id, 'note' => 5]);
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/mes-stats');

        $response->assertStatus(200)
            ->assertJsonStructure(['total_avis', 'note_moyenne', 'genre_prefere']);
    }
}
