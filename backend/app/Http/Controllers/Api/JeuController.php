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
    public function index()
    {
        $query = Jeu::with(['developpeur', 'plateformes', 'categories'])
            ->when(request('search'), fn($q) =>
                $q->where('titre', 'like', '%' . request('search') . '%')
            )
            ->when(request('plateforme_id'), fn($q) =>
                $q->whereHas('plateformes', fn($q2) =>
                    $q2->where('plateformes.id', request('plateforme_id'))
                )
            )
            ->when(request('categorie_id'), fn($q) =>
                $q->whereHas('categories', fn($q2) =>
                    $q2->where('categories.id', request('categorie_id'))
                )
            )
            ->orderBy('titre');

        // ?all=true → liste complète pour les selects (ex: page avis admin)
        if (request()->boolean('all')) {
            $jeux = $query->get(['id', 'titre']); // on prend seulement id+titre, léger
            return response()->json(['data' => $jeux]);
        }

        return new JeuCollection($query->paginate(12));
    }

    public function show(Jeu $jeu)
    {
        $jeu->load(['developpeur', 'plateformes', 'categories', 'avis.user']);
        return new JeuResource($jeu);
    }

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

    public function destroy(Jeu $jeu)
    {
        $jeu->delete();
        return response()->json(['message' => 'Jeu supprimé avec succès']);
    }
}
