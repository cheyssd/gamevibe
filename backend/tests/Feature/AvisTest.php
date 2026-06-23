<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Jeu;
use App\Models\Avis;
use App\Models\Developpeur;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AvisTest extends TestCase
{
    use RefreshDatabase;

    public function test_n_importe_qui_peut_voir_les_avis_d_un_jeu(): void
    {
        $developpeur = Developpeur::factory()->create();
        $jeu = Jeu::factory()->create(['developpeur_id' => $developpeur->id]);
        $user = User::factory()->create();
        Avis::factory()->create(['jeu_id' => $jeu->id, 'user_id' => $user->id]);

        $response = $this->getJson("/api/jeux/{$jeu->id}/avis");

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
    }

    public function test_un_user_connecte_peut_poster_un_avis(): void
    {
        $user = User::factory()->create();
        $developpeur = Developpeur::factory()->create();
        $jeu = Jeu::factory()->create(['developpeur_id' => $developpeur->id]);
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson("/api/jeux/{$jeu->id}/avis", [
                'note' => 5,
                'commentaire' => 'Un chef-d\'oeuvre !',
            ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('avis', [
            'user_id' => $user->id,
            'jeu_id' => $jeu->id,
            'note' => 5,
        ]);
    }

    public function test_un_visiteur_non_connecte_ne_peut_pas_poster_un_avis(): void
    {
        $developpeur = Developpeur::factory()->create();
        $jeu = Jeu::factory()->create(['developpeur_id' => $developpeur->id]);

        $response = $this->postJson("/api/jeux/{$jeu->id}/avis", [
            'note' => 5,
            'commentaire' => 'Un chef-d\'oeuvre !',
        ]);

        $response->assertStatus(401);
    }

    public function test_un_user_ne_peut_pas_poster_deux_avis_sur_le_meme_jeu(): void
    {
        $user = User::factory()->create();
        $developpeur = Developpeur::factory()->create();
        $jeu = Jeu::factory()->create(['developpeur_id' => $developpeur->id]);
        $token = $user->createToken('test')->plainTextToken;

        Avis::factory()->create(['user_id' => $user->id, 'jeu_id' => $jeu->id]);

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson("/api/jeux/{$jeu->id}/avis", [
                'note' => 4,
                'commentaire' => 'Un autre avis',
            ]);

        $response->assertStatus(422);
    }

    public function test_la_note_moyenne_du_jeu_se_met_a_jour_apres_un_avis(): void
    {
        $user = User::factory()->create();
        $developpeur = Developpeur::factory()->create();
        $jeu = Jeu::factory()->create(['developpeur_id' => $developpeur->id]);
        $token = $user->createToken('test')->plainTextToken;

        $this->withHeader('Authorization', "Bearer $token")
            ->postJson("/api/jeux/{$jeu->id}/avis", [
                'note' => 5,
                'commentaire' => 'Excellent',
            ]);

        $this->assertEquals(5, $jeu->fresh()->note_moyenne);
    }

    public function test_un_user_peut_modifier_son_propre_avis(): void
    {
        $user = User::factory()->create();
        $developpeur = Developpeur::factory()->create();
        $jeu = Jeu::factory()->create(['developpeur_id' => $developpeur->id]);
        $avis = Avis::factory()->create(['user_id' => $user->id, 'jeu_id' => $jeu->id, 'note' => 3]);
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->putJson("/api/jeux/{$jeu->id}/avis/{$avis->id}", [
                'note' => 5,
                'commentaire' => 'Avis modifié',
            ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('avis', ['id' => $avis->id, 'note' => 5]);
    }

    public function test_un_user_ne_peut_pas_modifier_l_avis_d_un_autre(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $developpeur = Developpeur::factory()->create();
        $jeu = Jeu::factory()->create(['developpeur_id' => $developpeur->id]);
        $avis = Avis::factory()->create(['user_id' => $user1->id, 'jeu_id' => $jeu->id]);
        $token = $user2->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->putJson("/api/jeux/{$jeu->id}/avis/{$avis->id}", [
                'note' => 1,
                'commentaire' => 'Je modifie ton avis',
            ]);

        $response->assertStatus(403);
    }

    public function test_un_user_peut_supprimer_son_propre_avis(): void
    {
        $user = User::factory()->create();
        $developpeur = Developpeur::factory()->create();
        $jeu = Jeu::factory()->create(['developpeur_id' => $developpeur->id]);
        $avis = Avis::factory()->create(['user_id' => $user->id, 'jeu_id' => $jeu->id]);
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->deleteJson("/api/jeux/{$jeu->id}/avis/{$avis->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('avis', ['id' => $avis->id]);
    }

    public function test_un_admin_peut_supprimer_n_importe_quel_avis(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $autreUser = User::factory()->create();
        $developpeur = Developpeur::factory()->create();
        $jeu = Jeu::factory()->create(['developpeur_id' => $developpeur->id]);
        $avis = Avis::factory()->create(['user_id' => $autreUser->id, 'jeu_id' => $jeu->id]);
        $token = $admin->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->deleteJson("/api/jeux/{$jeu->id}/avis/{$avis->id}");

        $response->assertStatus(200);
    }
}
