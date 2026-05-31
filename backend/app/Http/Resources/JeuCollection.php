<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class JeuCollection extends ResourceCollection
{
    public function toArray($request): array
    {
        return [
            'data' => $this->collection,
            'meta' => [
                'total' => $this->total(),
                'par_page' => $this->perPage(),
                'page_actuelle' => $this->currentPage(),
                'derniere_page' => $this->lastPage(),
            ],
        ];
    }
}
