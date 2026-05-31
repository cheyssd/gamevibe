<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\JeuController;
use App\Http\Controllers\Api\AvisController;
use App\Http\Controllers\Api\CategorieController;
use App\Http\Controllers\Api\PlateformeController;
use App\Http\Controllers\Api\DeveloppeurController;
use App\Http\Controllers\Api\UserController;

// ===== ROUTES PUBLIQUES =====
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Jeux (lecture publique)
Route::get('/jeux', [JeuController::class, 'index']);
Route::get('/jeux/{jeu}', [JeuController::class, 'show']);

// Avis (lecture publique)
Route::get('/jeux/{jeu}/avis', [AvisController::class, 'index']);

// Catégories (lecture publique)
Route::get('/categories', [CategorieController::class, 'index']);

// Plateformes (lecture publique)
Route::get('/plateformes', [PlateformeController::class, 'index']);

// Développeurs (lecture publique)
Route::get('/developpeurs', [DeveloppeurController::class, 'index']);

// ===== ROUTES PRIVÉES (connecté) =====
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::put('/password', [AuthController::class, 'updatePassword']);

    // Mes avis et stats
    Route::get('/mes-avis', [UserController::class, 'mesAvis']);
    Route::get('/mes-stats', [UserController::class, 'mesStats']);

    // Avis (connecté)
    Route::post('/jeux/{jeu}/avis', [AvisController::class, 'store']);
    Route::put('/jeux/{jeu}/avis/{avis}', [AvisController::class, 'update']);
    Route::delete('/jeux/{jeu}/avis/{avis}', [AvisController::class, 'destroy']);

    // ===== ROUTES ADMIN =====
    Route::middleware('admin')->group(function () {

        // Jeux (admin)
        Route::post('/jeux', [JeuController::class, 'store']);
        Route::put('/jeux/{jeu}', [JeuController::class, 'update']);
        Route::delete('/jeux/{jeu}', [JeuController::class, 'destroy']);

        // Catégories (admin)
        Route::post('/categories', [CategorieController::class, 'store']);
        Route::put('/categories/{categorie}', [CategorieController::class, 'update']);
        Route::delete('/categories/{categorie}', [CategorieController::class, 'destroy']);

        // Plateformes (admin)
        Route::post('/plateformes', [PlateformeController::class, 'store']);
        Route::put('/plateformes/{plateforme}', [PlateformeController::class, 'update']);
        Route::delete('/plateformes/{plateforme}', [PlateformeController::class, 'destroy']);

        // Développeurs (admin)
        Route::post('/developpeurs', [DeveloppeurController::class, 'store']);
        Route::put('/developpeurs/{developpeur}', [DeveloppeurController::class, 'update']);
        Route::delete('/developpeurs/{developpeur}', [DeveloppeurController::class, 'destroy']);

        // Utilisateurs (admin)
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/{user}', [UserController::class, 'show']);
        Route::delete('/users/{user}', [UserController::class, 'destroy']);
    });
});
