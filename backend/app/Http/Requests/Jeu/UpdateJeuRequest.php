<?php

namespace App\Http\Requests\Jeu;

use Illuminate\Foundation\Http\FormRequest;

class UpdateJeuRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'titre' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'image' => 'nullable|string',
            'date_sortie' => 'sometimes|date',
            'developpeur_id' => 'sometimes|exists:developpeurs,uuid',
            'plateformes' => 'sometimes|array',
            'plateformes.*' => 'exists:plateformes,uuid',
            'categories' => 'sometimes|array',
            'categories.*' => 'exists:categories,uuid',
        ];
    }
}
