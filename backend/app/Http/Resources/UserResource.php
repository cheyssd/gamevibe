<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'           => $this->uuid,
            'nom'          => $this->name,
            'email'        => $this->email,
            'role'         => $this->role,
            'image_profil' => $this->image_profil,
            'cree_le'      => $this->created_at->format('d/m/Y'),
            'desactive'    => $this->trashed(),
            'desactive_le' => $this->deleted_at?->format('d/m/Y'),
        ];
    }
}
