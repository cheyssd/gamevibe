<?php

namespace App\Http\Requests\Avis;

use Illuminate\Foundation\Http\FormRequest;

class StoreAvisRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'note' => 'required|integer|min:1|max:5',
            'commentaire' => 'required|string|max:1000',
        ];
    }
}
