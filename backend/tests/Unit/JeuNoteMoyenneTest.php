<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Jeu;
use App\Models\User;
use App\Models\Avis;
use App\Models\Developpeur;
use Illuminate\Foundation\Testing\RefreshDatabase;

class JeuNoteMoyenneTest extends TestCase
{
    use RefreshDatabase;

    public function test_la_note_moyenne_est_correcte_avec_plusieurs_avis(): void
    {
        $developpeur = Developpeur::factory()->create();
        $jeu = Jeu::factory()->create(['developpeur_id' => $developpeur->id]);

        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $user3 = User::factory()->create();

        Avis::factory()->create(['jeu_id' => $jeu->id, 'user_id' => $user1->id, 'note' => 5]);
        Avis::factory()->create(['jeu_id' => $jeu->id, 'user_id' => $user2->id, 'note' => 3]);
        Avis::factory()->create(['jeu_id' => $jeu->id, 'user_id' => $user3->id, 'note' => 4]);

        $jeu->update(['note_moyenne' => $jeu->avis()->avg('note')]);

        $this->assertEquals(4.0, $jeu->fresh()->note_moyenne);
    }

    public function test_la_note_moyenne_est_nulle_sans_avis(): void
    {
        $developpeur = Developpeur::factory()->create();
        $jeu = Jeu::factory()->create(['developpeur_id' => $developpeur->id]);

        $moyenne = $jeu->avis()->avg('note');

        $this->assertNull($moyenne);
    }

    public function test_la_note_moyenne_se_met_a_jour_apres_suppression_avis(): void
    {
        $developpeur = Developpeur::factory()->create();
        $jeu = Jeu::factory()->create(['developpeur_id' => $developpeur->id]);

        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        $avis1 = Avis::factory()->create(['jeu_id' => $jeu->id, 'user_id' => $user1->id, 'note' => 5]);
        Avis::factory()->create(['jeu_id' => $jeu->id, 'user_id' => $user2->id, 'note' => 3]);

        $avis1->delete();

        $jeu->update(['note_moyenne' => $jeu->avis()->avg('note') ?? 0]);

        $this->assertEquals(3.0, $jeu->fresh()->note_moyenne);
    }
}
