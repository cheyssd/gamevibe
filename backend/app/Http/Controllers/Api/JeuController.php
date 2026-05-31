<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Jeu\StoreJeuRequest;
use App\Http\Requests\Jeu\UpdateJeuRequest;
use App\Http\Resources\JeuResource;
use App\Http\Resources\JeuCollection;
use App\Models\Jeu;

class JeuController extends Controller
{
    // Liste tous les jeux (public)
    public function index()
    {
        $jeux = Jeu::with(['developpeur', 'plateformes', 'categories'])
            ->when(request('search'), function ($query) {
                $query->where('titre', 'like', '%' . request('search') . '%');
            })
            ->when(request('plateforme_id'), function ($query) {
                $query->whereHas('plateformes', function ($q) {
                    $q->where('plateformes.id', request('plateforme_id'));
                });
            })
            ->when(request('categorie_id'), function ($query) {
                $query->whereHas('categories', function ($q) {
                    $q->where('categories.id', request('categorie_id'));
                });
            })
            ->paginate(12);

        return new JeuCollection($jeux);
    }

    // Voir un jeu (public)
    public function show(Jeu $jeu)
    {
        $jeu->load(['developpeur', 'plateformes', 'categories', 'avis.user']);
        return new JeuResource($jeu);
    }

    // Ajouter un jeu (admin)
    public function store(StoreJeuRequest $request)
    {
        $jeu = Jeu::create($request->validated());

        if ($request->has('plateformes')) {
            $jeu->plateformes()->sync($request->plateformes);
        }

        if ($request->has('categories')) {
            $jeu->categories()->sync($request->categories);
        }

        return response()->json([
            'message' => 'Jeu ajouté avec succès',
            'jeu' => new JeuResource($jeu->load(['developpeur', 'plateformes', 'categories']))
        ], 201);
    }

    // Modifier un jeu (admin)
    public function update(UpdateJeuRequest $request, Jeu $jeu)
    {
        $jeu->update($request->validated());

        if ($request->has('plateformes')) {
            $jeu->plateformes()->sync($request->plateformes);
        }

        if ($request->has('categories')) {
            $jeu->categories()->sync($request->categories);
        }

        return response()->json([
            'message' => 'Jeu modifié avec succès',
            'jeu' => new JeuResource($jeu->load(['developpeur', 'plateformes', 'categories']))
        ]);
    }

    // Supprimer un jeu (admin)
    public function destroy(Jeu $jeu)
    {
        $jeu->delete();

        return response()->json([
            'message' => 'Jeu supprimé avec succès'
        ]);
    }
}
