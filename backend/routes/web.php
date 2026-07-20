<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// API pure (frontend React separe) : pas de page de login Laravel.
// Cette route existe uniquement pour que le middleware d'authentification
// ait un named route "login" vers lequel se rabattre sans planter
// (RouteNotFoundException) quand une requete non authentifiee n'envoie
// pas l'en-tete Accept: application/json.
Route::get('/login', function () {
    return response()->json(['message' => 'Unauthenticated.'], 401);
})->name('login');
