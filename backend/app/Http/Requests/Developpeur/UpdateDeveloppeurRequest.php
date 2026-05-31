<?php

namespace App\Http\Requests\Developpeur;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDeveloppeurRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'nom' => 'sometimes|string|max:255|unique:developpeurs,nom',
        ];
    }
}
