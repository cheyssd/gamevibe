<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Http\Requests\Avis\StoreAvisRequest;
use Illuminate\Support\Facades\Validator;

class StoreAvisRequestTest extends TestCase
{
    private function rules(): array
    {
        return (new StoreAvisRequest())->rules();
    }

    public function test_une_note_valide_passe_la_validation(): void
    {
        $validator = Validator::make([
            'note' => 4,
            'commentaire' => 'Très bon jeu !',
        ], $this->rules());

        $this->assertFalse($validator->fails());
    }

    public function test_une_note_superieure_a_5_est_refusee(): void
    {
        $validator = Validator::make([
            'note' => 6,
            'commentaire' => 'Très bon jeu !',
        ], $this->rules());

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('note', $validator->errors()->toArray());
    }

    public function test_une_note_inferieure_a_1_est_refusee(): void
    {
        $validator = Validator::make([
            'note' => 0,
            'commentaire' => 'Très bon jeu !',
        ], $this->rules());

        $this->assertTrue($validator->fails());
    }

    public function test_un_commentaire_vide_est_refuse(): void
    {
        $validator = Validator::make([
            'note' => 4,
            'commentaire' => '',
        ], $this->rules());

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('commentaire', $validator->errors()->toArray());
    }

    public function test_un_commentaire_trop_long_est_refuse(): void
    {
        $validator = Validator::make([
            'note' => 4,
            'commentaire' => str_repeat('a', 1001),
        ], $this->rules());

        $this->assertTrue($validator->fails());
    }
}
