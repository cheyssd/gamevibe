<?php

namespace App\Http\Requests\Avis;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAvisRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'note' => 'sometimes|integer|min:1|max:5',
            'commentaire' => 'sometimes|string|max:1000',
        ];
    }
}
