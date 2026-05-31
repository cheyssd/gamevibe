<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Categorie\StoreCategorieRequest;
use App\Http\Requests\Categorie\UpdateCategorieRequest;
use App\Http\Resources\CategorieResource;
use App\Models\Categorie;

class CategorieController extends Controller
{
    // Liste toutes les catégories (public)
    public function index()
    {
        $categories = Categorie::all();
        return CategorieResource::collection($categories);
    }

    // Ajouter une catégorie (admin)
    public function store(StoreCategorieRequest $request)
    {
        $categorie = Categorie::create($request->validated());

        return response()->json([
            'message' => 'Catégorie ajoutée avec succès',
            'categorie' => new CategorieResource($categorie)
        ], 201);
    }

    // Modifier une catégorie (admin)
    public function update(UpdateCategorieRequest $request, Categorie $categorie)
    {
        $categorie->update($request->validated());

        return response()->json([
            'message' => 'Catégorie modifiée avec succès',
            'categorie' => new CategorieResource($categorie)
        ]);
    }

    // Supprimer une catégorie (admin)
    public function destroy(Categorie $categorie)
    {
        $categorie->delete();

        return response()->json([
            'message' => 'Catégorie supprimée avec succès'
        ]);
    }
}
