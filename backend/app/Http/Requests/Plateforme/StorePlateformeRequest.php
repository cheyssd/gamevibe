<?php

namespace App\Http\Requests\Plateforme;

use Illuminate\Foundation\Http\FormRequest;

class StorePlateformeRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'nom' => 'required|string|max:255|unique:plateformes,nom',
        ];
    }
}
