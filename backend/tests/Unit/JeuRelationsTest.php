<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Jeu;
use App\Models\Developpeur;
use App\Models\Plateforme;
use App\Models\Categorie;
use Illuminate\Foundation\Testing\RefreshDatabase;

class JeuRelationsTest extends TestCase
{
    use RefreshDatabase;

    public function test_un_jeu_peut_avoir_plusieurs_plateformes(): void
    {
        $developpeur = Developpeur::factory()->create();
        $jeu = Jeu::factory()->create(['developpeur_id' => $developpeur->id]);

        $pc = Plateforme::factory()->create(['nom' => 'PC']);
        $ps5 = Plateforme::factory()->create(['nom' => 'PS5']);

        $jeu->plateformes()->attach([$pc->id, $ps5->id]);

        $this->assertCount(2, $jeu->plateformes);
        $this->assertTrue($jeu->plateformes->contains($pc));
        $this->assertTrue($jeu->plateformes->contains($ps5));
    }

    public function test_un_jeu_peut_avoir_plusieurs_categories(): void
    {
        $developpeur = Developpeur::factory()->create();
        $jeu = Jeu::factory()->create(['developpeur_id' => $developpeur->id]);

        $rpg = Categorie::factory()->create(['nom' => 'RPG']);
        $action = Categorie::factory()->create(['nom' => 'Action']);

        $jeu->categories()->attach([$rpg->id, $action->id]);

        $this->assertCount(2, $jeu->categories);
    }

    public function test_un_jeu_appartient_a_un_developpeur(): void
    {
        $developpeur = Developpeur::factory()->create(['nom' => 'FromSoftware']);
        $jeu = Jeu::factory()->create(['developpeur_id' => $developpeur->id]);

        $this->assertEquals('FromSoftware', $jeu->developpeur->nom);
    }

    public function test_supprimer_une_plateforme_du_jeu_fonctionne(): void
    {
        $developpeur = Developpeur::factory()->create();
        $jeu = Jeu::factory()->create(['developpeur_id' => $developpeur->id]);

        $pc = Plateforme::factory()->create();
        $ps5 = Plateforme::factory()->create();

        $jeu->plateformes()->attach([$pc->id, $ps5->id]);
        $jeu->plateformes()->detach($pc->id);

        $this->assertCount(1, $jeu->fresh()->plateformes);
    }
}
