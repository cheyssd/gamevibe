<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Developpeur\StoreDeveloppeurRequest;
use App\Http\Requests\Developpeur\UpdateDeveloppeurRequest;
use App\Http\Resources\DeveloppeurResource;
use App\Models\Developpeur;

class DeveloppeurController extends Controller
{
    public function index()
    {
        // ?all=true → tout charger (pour les selects du formulaire)
        // sans paramètre → paginé (pour la page de listing admin)
        if (request()->boolean('all')) {
            $developpeurs = Developpeur::orderBy('nom')->get();
            return response()->json(['data' => DeveloppeurResource::collection($developpeurs)]);
        }

        $developpeurs = Developpeur::orderBy('nom')->paginate(10);
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
