<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\JeuController;
use App\Http\Controllers\Api\AvisController;
use App\Http\Controllers\Api\CategorieController;
use App\Http\Controllers\Api\PlateformeController;
use App\Http\Controllers\Api\DeveloppeurController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\UserController;

// ===== ROUTES PUBLIQUES =====
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);
Route::get('/admin/stats', [AdminController::class, 'stats']);

Route::get('/jeux',        [JeuController::class, 'index']);
Route::get('/jeux/{jeu}',  [JeuController::class, 'show']);

Route::get('/jeux/{jeu}/avis', [AvisController::class, 'index']);

Route::get('/categories',  [CategorieController::class, 'index']);
Route::get('/plateformes', [PlateformeController::class, 'index']);
Route::get('/developpeurs',[DeveloppeurController::class, 'index']);

// ===== ROUTES PRIVÉES (connecté) =====
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout',          [AuthController::class, 'logout']);
    Route::put('/profile',          [AuthController::class, 'updateProfile']);
    Route::put('/password',         [AuthController::class, 'updatePassword']);
    Route::delete('/account',       [AuthController::class, 'deleteAccount']);

    Route::get('/mes-avis',  [UserController::class, 'mesAvis']);
    Route::get('/mes-stats', [UserController::class, 'mesStats']);

    Route::post('/jeux/{jeu}/avis',          [AvisController::class, 'store']);
    Route::put('/jeux/{jeu}/avis/{avis}',    [AvisController::class, 'update']);
    Route::delete('/jeux/{jeu}/avis/{avis}', [AvisController::class, 'destroy']);

    // ===== ROUTES ADMIN =====
    Route::middleware('admin')->group(function () {

        // Avis (admin) — vue globale paginée et filtrable par jeu
        Route::get('/avis', [AvisController::class, 'indexAdmin']);

        // Jeux (admin)
        Route::post('/jeux',         [JeuController::class, 'store']);
        Route::put('/jeux/{jeu}',    [JeuController::class, 'update']);
        Route::delete('/jeux/{jeu}', [JeuController::class, 'destroy']);

        // Catégories (admin)
        Route::post('/categories',               [CategorieController::class, 'store']);
        Route::put('/categories/{categorie}',     [CategorieController::class, 'update']);
        Route::delete('/categories/{categorie}',  [CategorieController::class, 'destroy']);

        // Plateformes (admin)
        Route::post('/plateformes',                [PlateformeController::class, 'store']);
        Route::put('/plateformes/{plateforme}',    [PlateformeController::class, 'update']);
        Route::delete('/plateformes/{plateforme}', [PlateformeController::class, 'destroy']);

        // Développeurs (admin)
        Route::post('/developpeurs',                 [DeveloppeurController::class, 'store']);
        Route::put('/developpeurs/{developpeur}',     [DeveloppeurController::class, 'update']);
        Route::delete('/developpeurs/{developpeur}',  [DeveloppeurController::class, 'destroy']);

        // Utilisateurs (admin)
        Route::get('/users',                 [UserController::class, 'index']);
        Route::get('/users/avec-desactives', [UserController::class, 'indexAvecDesactives']);
        Route::get('/users/{user}',          [UserController::class, 'show']);
        Route::delete('/users/{user}',       [UserController::class, 'destroy']);
        Route::post('/users/{id}/restore',   [UserController::class, 'restore']);
    });
});
