<?php

namespace App\Http\Requests\Plateforme;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePlateformeRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'nom' => 'sometimes|string|max:255|unique:plateformes,nom',
        ];
    }
}
