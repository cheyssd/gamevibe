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
}
