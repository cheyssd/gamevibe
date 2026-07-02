<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AvisResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->uuid,
            'note' => $this->note,
            'commentaire' => $this->commentaire,
            'user' => new UserResource($this->whenLoaded('user')),
            'jeu' => new JeuResource($this->whenLoaded('jeu')),
            'cree_le' => $this->created_at->format('d/m/Y'),
            'modifie_le' => $this->updated_at->format('d/m/Y'),
        ];
    }
}
