<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Avis\StoreAvisRequest;
use App\Http\Requests\Avis\UpdateAvisRequest;
use App\Http\Resources\AvisResource;
use App\Models\Avis;
use App\Models\Jeu;

class AvisController extends Controller
{
    // Liste les avis d'un jeu (public)
    public function index(Jeu $jeu)
    {
        if (request()->boolean('all')) {
            $avis = $jeu->avis()->with('user')->latest()->get();
            return response()->json(['data' => AvisResource::collection($avis)]);
        }
        $avis = Avis::where('jeu_id', $jeu->id)->with('user')->latest()->paginate(10);


        return AvisResource::collection($avis);
    }

    // Poster un avis (connecté)
    public function store(StoreAvisRequest $request, Jeu $jeu)
    {
        // Vérifier si l'utilisateur a déjà posté un avis sur ce jeu
        $existingAvis = Avis::where('user_id', $request->user()->id)
            ->where('jeu_id', $jeu->id)
            ->first();

        if ($existingAvis) {
            return response()->json([
                'message' => 'Vous avez déjà posté un avis sur ce jeu'
            ], 422);
        }

        $avis = Avis::create([
            'user_id' => $request->user()->id,
            'jeu_id' => $jeu->id,
            'note' => $request->note,
            'commentaire' => $request->commentaire,
        ]);

        // Recalculer la note moyenne du jeu
        $jeu->update([
            'note_moyenne' => $jeu->avis()->avg('note')
        ]);

        return response()->json([
            'message' => 'Avis posté avec succès',
            'avis' => new AvisResource($avis->load('user'))
        ], 201);
    }

    // Modifier un avis (connecté - propriétaire uniquement)
    public function update(UpdateAvisRequest $request, Jeu $jeu, Avis $avis)
    {
        // Vérifier que l'utilisateur est le propriétaire
        if ($request->user()->id !== $avis->user_id) {
            return response()->json([
                'message' => 'Action non autorisée'
            ], 403);
        }

        $avis->update([
            'note' => $request->note ?? $avis->note,
            'commentaire' => $request->commentaire ?? $avis->commentaire,
        ]);

        // Recalculer la note moyenne du jeu
        $jeu->update([
            'note_moyenne' => $jeu->avis()->avg('note')
        ]);

        return response()->json([
            'message' => 'Avis modifié avec succès',
            'avis' => new AvisResource($avis->load('user'))
        ]);
    }

    // Supprimer un avis (connecté - propriétaire ou admin)
    public function destroy(Jeu $jeu, Avis $avis)
    {
        $user = request()->user();

        // Vérifier que l'utilisateur est le propriétaire ou admin
        if ($user->id !== $avis->user_id && $user->role !== 'admin') {
            return response()->json([
                'message' => 'Action non autorisée'
            ], 403);
        }

        $avis->delete();

        // Recalculer la note moyenne du jeu
        $jeu->update([
            'note_moyenne' => $jeu->avis()->avg('note') ?? 0
        ]);

        return response()->json([
            'message' => 'Avis supprimé avec succès'
        ]);
    }
}
