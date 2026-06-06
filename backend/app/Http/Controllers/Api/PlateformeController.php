<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Plateforme\StorePlateformeRequest;
use App\Http\Requests\Plateforme\UpdatePlateformeRequest;
use App\Http\Resources\PlateformeResource;
use App\Models\Plateforme;

class PlateformeController extends Controller
{
    // Liste toutes les plateformes (public)
    public function index()
    {
        $plateformes = Plateforme::paginate(10);
        return PlateformeResource::collection($plateformes);
    }

    // Ajouter une plateforme (admin)
    public function store(StorePlateformeRequest $request)
    {
        $plateforme = Plateforme::create($request->validated());

        return response()->json([
            'message' => 'Plateforme ajoutée avec succès',
            'plateforme' => new PlateformeResource($plateforme)
        ], 201);
    }

    // Modifier une plateforme (admin)
    public function update(UpdatePlateformeRequest $request, Plateforme $plateforme)
    {
        $plateforme->update($request->validated());

        return response()->json([
            'message' => 'Plateforme modifiée avec succès',
            'plateforme' => new PlateformeResource($plateforme)
        ]);
    }

    // Supprimer une plateforme (admin)
    public function destroy(Plateforme $plateforme)
    {
        $plateforme->delete();

        return response()->json([
            'message' => 'Plateforme supprimée avec succès'
        ]);
    }
}
