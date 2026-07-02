<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Avis\StoreAvisRequest;
use App\Http\Requests\Avis\UpdateAvisRequest;
use App\Http\Resources\AvisResource;
use App\Models\Avis;
use App\Models\Jeu;
use Illuminate\Support\Facades\DB;

class AvisController extends Controller
{

    public function index(Jeu $jeu)
    {
        if (request()->boolean('all')) {
            $avis = $jeu->avis()->with('user')->latest()->get();
            return response()->json(['data' => AvisResource::collection($avis)]);
        }
        $avis = Avis::where('jeu_id', $jeu->id)->with('user')->latest()->paginate(10);

        return AvisResource::collection($avis);
    }


    public function indexAdmin()
    {
        $query = Avis::with(['user', 'jeu'])
            ->when(request('jeu_id'), fn ($q) => $q->whereHas('jeu', fn ($q2) =>
                $q2->where('uuid', request('jeu_id'))
            ))
            ->latest();

        $avis = $query->paginate(10);

        return AvisResource::collection($avis)->additional([
            'meta' => [
                'total'          => $avis->total(),
                'par_page'       => $avis->perPage(),
                'page_actuelle'  => $avis->currentPage(),
                'derniere_page'  => $avis->lastPage(),
            ],
        ]);
    }


    public function store(StoreAvisRequest $request, Jeu $jeu)
    {
        return DB::transaction(function () use ($request, $jeu) {
            $jeu = Jeu::where('id', $jeu->id)->lockForUpdate()->firstOrFail();

            $existingAvis = Avis::where('user_id', $request->user()->id)
                ->where('jeu_id', $jeu->id)
                ->first();

            if ($existingAvis) {
                return response()->json([
                    'message' => 'Vous avez déjà posté un avis sur ce jeu'
                ], 422);
            }

            $avis = Avis::create([
                'user_id'     => $request->user()->id,
                'jeu_id'      => $jeu->id,
                'note'        => $request->note,
                'commentaire' => $request->commentaire,
            ]);

            $jeu->update([
                'note_moyenne' => $jeu->avis()->avg('note')
            ]);

            return response()->json([
                'message' => 'Avis posté avec succès',
                'avis'    => new AvisResource($avis->load('user'))
            ], 201);
        });
    }

    // Modifier un avis (connecté - propriétaire uniquement)
    public function update(UpdateAvisRequest $request, Jeu $jeu, Avis $avis)
    {
        if ($request->user()->id !== $avis->user_id) {
            return response()->json([
                'message' => 'Action non autorisée'
            ], 403);
        }

        return DB::transaction(function () use ($request, $jeu, $avis) {
            $jeu = Jeu::where('id', $jeu->id)->lockForUpdate()->firstOrFail();

            $avis->update([
                'note'        => $request->note ?? $avis->note,
                'commentaire' => $request->commentaire ?? $avis->commentaire,
            ]);

            $jeu->update([
                'note_moyenne' => $jeu->avis()->avg('note')
            ]);

            return response()->json([
                'message' => 'Avis modifié avec succès',
                'avis'    => new AvisResource($avis->load('user'))
            ]);
        });
    }


    public function destroy(Jeu $jeu, Avis $avis)
    {
        $user = request()->user();

        if ($user->id !== $avis->user_id && $user->role !== 'admin') {
            return response()->json([
                'message' => 'Action non autorisée'
            ], 403);
        }

        return DB::transaction(function () use ($jeu, $avis) {
            $jeu = Jeu::where('id', $jeu->id)->lockForUpdate()->firstOrFail();

            $avis->delete();

            $jeu->update([
                'note_moyenne' => $jeu->avis()->avg('note') ?? 0
            ]);

            return response()->json([
                'message' => 'Avis supprimé avec succès'
            ]);
        });
    }
}
