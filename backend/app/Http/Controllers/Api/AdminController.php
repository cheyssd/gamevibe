<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Jeu;
use App\Models\User;
use App\Models\Avis;
use App\Models\Categorie;
use App\Models\Plateforme;

class AdminController extends Controller
{
    public function stats()
    {
        return response()->json([
            'totalJeux' => Jeu::count(),
            'totalUsers' => User::count(),
            'totalAvis' => Avis::count(),
            'totalCategories' => Categorie::count(),
            'totalPlateformes' => Plateforme::count(),
        ]);
    }

    /**
     * Statistiques globales pour la page d'accueil publique.
     * Volontairement distinct de stats() (espace admin) : n'expose que
     * les 3 compteurs affiches publiquement, pas de middleware admin requis.
     */
    public function publicStats()
    {
        return response()->json([
            'totalJeux' => Jeu::count(),
            'totalAvis' => Avis::count(),
            'totalUsers' => User::count(),
        ]);
    }
}
