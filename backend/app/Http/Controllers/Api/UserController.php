<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Http\Resources\AvisResource;
use App\Models\User;

class UserController extends Controller
{
    // Liste tous les utilisateurs (admin)
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

    // Désactiver un compte (admin - soft delete)
    public function destroy(User $user)
    {
        $user->delete();

        return response()->json([
            'message' => 'Compte désactivé avec succès'
        ]);
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

        $totalAvis = $user->avis()->count();
        $noteMoyenne = $user->avis()->avg('note');
        $genresPreferes = $user->avis()
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
            'total_avis' => $totalAvis,
            'note_moyenne' => round($noteMoyenne, 1),
            'genre_prefere' => $genresPreferes ?? 'Aucun',
        ]);
    }
}
