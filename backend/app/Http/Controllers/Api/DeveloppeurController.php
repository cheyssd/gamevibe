<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Developpeur\StoreDeveloppeurRequest;
use App\Http\Requests\Developpeur\UpdateDeveloppeurRequest;
use App\Http\Resources\DeveloppeurResource;
use App\Models\Developpeur;

class DeveloppeurController extends Controller
{
    // Liste tous les développeurs (public)
    public function index()
    {
        $developpeurs = Developpeur::all();
        return DeveloppeurResource::collection($developpeurs);
    }

    // Ajouter un développeur (admin)
    public function store(StoreDeveloppeurRequest $request)
    {
        $developpeur = Developpeur::create($request->validated());

        return response()->json([
            'message' => 'Développeur ajouté avec succès',
            'developpeur' => new DeveloppeurResource($developpeur)
        ], 201);
    }

    // Modifier un développeur (admin)
    public function update(UpdateDeveloppeurRequest $request, Developpeur $developpeur)
    {
        $developpeur->update($request->validated());

        return response()->json([
            'message' => 'Développeur modifié avec succès',
            'developpeur' => new DeveloppeurResource($developpeur)
        ]);
    }

    // Supprimer un développeur (admin)
    public function destroy(Developpeur $developpeur)
    {
        $developpeur->delete();

        return response()->json([
            'message' => 'Développeur supprimé avec succès'
        ]);
    }
}
