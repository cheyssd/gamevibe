<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Http\Resources\AvisResource;
use App\Models\User;

class UserController extends Controller
{
    public function index()
    {
        $users = User::paginate(10);
        return UserResource::collection($users);
    }

    public function show(User $user)
    {
        return new UserResource($user);
    }

    public function destroy(User $user)
    {
        $user->delete();

        return response()->json([
            'message' => 'Compte désactivé avec succès'
        ]);
    }

    public function restore(int $id)
    {
        $user = User::withTrashed()->findOrFail($id);
        $user->restore();

        return response()->json([
            'message' => 'Compte réactivé avec succès'
        ]);
    }


    public function indexAvecDesactives()
    {
        $users = User::withTrashed()->paginate(10);
        return UserResource::collection($users);
    }


    public function mesAvis()
    {
        $user = request()->user();
        $avis = $user->avis()->with('jeu')->latest()->get();
        return AvisResource::collection($avis);
    }


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
