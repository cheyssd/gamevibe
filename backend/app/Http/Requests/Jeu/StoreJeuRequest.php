<?php

namespace App\Http\Requests\Jeu;

use Illuminate\Foundation\Http\FormRequest;

class StoreJeuRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'titre' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|string',
            'date_sortie' => 'required|date',
            'developpeur_id' => 'required|exists:developpeurs,id',
            'plateformes' => 'required|array',
            'plateformes.*' => 'exists:plateformes,id',
            'categories' => 'required|array',
            'categories.*' => 'exists:categories,id',
        ];
    }
}
