<?php

namespace App\Http\Requests\Developpeur;

use Illuminate\Foundation\Http\FormRequest;

class StoreDeveloppeurRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'nom' => 'required|string|max:255|unique:developpeurs,nom',
        ];
    }
}
