<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Developpeur;

class Jeu extends Model
{
    use HasFactory;

    protected $table = 'jeux';

    protected $fillable = [
        'titre',
        'description',
        'image',
        'date_sortie',
        'note_moyenne',
        'developpeur_id',
    ];

    protected $casts = [
        'date_sortie' => 'date',
        'note_moyenne' => 'float',
    ];

    public function developpeur(): BelongsTo
    {
        return $this->belongsTo(Developpeur::class);
    }

    public function avis(): HasMany
    {
        return $this->hasMany(Avis::class);
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Categorie::class, 'jeu_categorie');
    }

    public function plateformes(): BelongsToMany
    {
        return $this->belongsToMany(Plateforme::class, 'jeu_plateforme');
    }
}
