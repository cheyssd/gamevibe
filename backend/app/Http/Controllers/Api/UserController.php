<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Http\Resources\AvisResource;
use App\Models\User;

class UserController extends Controller
{
    // Liste tous les utilisateurs (admin) — exclut les supprimés par défaut
    public function index()
    {
        $users = User::paginate(10);
        return UserResource::collection($users);
    }

    // Voir un utilisateur (admin)
    public function show(User $user)
    {
        return new UserResource($user);
    }

    // Désactiver un compte (admin) — soft delete
    public function destroy(User $user)
    {
        $user->delete(); // met deleted_at, ne supprime pas vraiment

        return response()->json([
            'message' => 'Compte désactivé avec succès'
        ]);
    }

    // Réactiver un compte (admin) — restore
    public function restore(int $id)
    {
        $user = User::withTrashed()->findOrFail($id);
        $user->restore(); // remet deleted_at à null

        return response()->json([
            'message' => 'Compte réactivé avec succès'
        ]);
    }

    // Liste tous les utilisateurs y compris désactivés (admin)
    public function indexAvecDesactives()
    {
        $users = User::withTrashed()->paginate(10);
        return UserResource::collection($users);
    }

    // Voir ses propres avis (connecté)
    public function mesAvis()
    {
        $user = request()->user();
        $avis = $user->avis()->with('jeu')->latest()->get();
        return AvisResource::collection($avis);
    }

    // Voir ses statistiques (connecté)
    public function mesStats()
    {
        $user = request()->user();

        $totalAvis    = $user->avis()->count();
        $noteMoyenne  = $user->avis()->avg('note');
        $genrePrefere = $user->avis()
            ->with('jeu.categories')
            ->get()
            ->pluck('jeu.categories')
            ->flatten()
            ->groupBy('nom')
            ->map->count()
            ->sortDesc()
            ->keys()
            ->first();

        return response()->json([
            'total_avis'    => $totalAvis,
            'note_moyenne'  => round($noteMoyenne, 1),
            'genre_prefere' => $genrePrefere ?? 'Aucun',
        ]);
    }
}
