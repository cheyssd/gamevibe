<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class JeuResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->uuid,
            'titre' => $this->titre,
            'description' => $this->description,
            'image' => $this->image,
            'date_sortie' => $this->date_sortie ? \Carbon\Carbon::parse($this->date_sortie)->format('d/m/Y') : null,
            'note_moyenne' => $this->note_moyenne,
            'developpeur' => new DeveloppeurResource($this->whenLoaded('developpeur')),
            'plateformes' => PlateformeResource::collection($this->whenLoaded('plateformes')),
            'categories' => CategorieResource::collection($this->whenLoaded('categories')),
            'avis' => AvisResource::collection($this->whenLoaded('avis')),
            'cree_le' => $this->created_at->format('d/m/Y'),
        ];
    }
}
