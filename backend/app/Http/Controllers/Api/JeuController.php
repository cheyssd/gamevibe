<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Jeu\StoreJeuRequest;
use App\Http\Requests\Jeu\UpdateJeuRequest;
use App\Http\Resources\JeuResource;
use App\Http\Resources\JeuCollection;
use App\Models\Jeu;
use App\Models\Categorie;
use App\Models\Developpeur;
use App\Models\Plateforme;

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
                    $q2->where('plateformes.uuid', request('plateforme_id'))
                )
            )
            ->when(request('categorie_id'), fn($q) =>
                $q->whereHas('categories', fn($q2) =>
                    $q2->where('categories.uuid', request('categorie_id'))
                )
            )
            ->orderBy('titre');


        if (request()->boolean('all')) {
            $jeux = $query->without(['developpeur', 'plateformes', 'categories'])
                ->get(['uuid', 'titre'])
                ->map(fn ($jeu) => ['id' => $jeu->uuid, 'titre' => $jeu->titre]);
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
        $data = $request->validated();
        $data['developpeur_id'] = Developpeur::where('uuid', $data['developpeur_id'])->value('id');

        $jeu = Jeu::create($data);

        if ($request->has('plateformes')) {
            $jeu->plateformes()->sync(Plateforme::whereIn('uuid', $request->plateformes)->pluck('id'));
        }
        if ($request->has('categories')) {
            $jeu->categories()->sync(Categorie::whereIn('uuid', $request->categories)->pluck('id'));
        }

        return response()->json([
            'message' => 'Jeu ajouté avec succès',
            'jeu' => new JeuResource($jeu->load(['developpeur', 'plateformes', 'categories']))
        ], 201);
    }

    public function update(UpdateJeuRequest $request, Jeu $jeu)
    {
        $data = $request->validated();
        if (isset($data['developpeur_id'])) {
            $data['developpeur_id'] = Developpeur::where('uuid', $data['developpeur_id'])->value('id');
        }

        $jeu->update($data);

        if ($request->has('plateformes')) {
            $jeu->plateformes()->sync(Plateforme::whereIn('uuid', $request->plateformes)->pluck('id'));
        }
        if ($request->has('categories')) {
            $jeu->categories()->sync(Categorie::whereIn('uuid', $request->categories)->pluck('id'));
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
