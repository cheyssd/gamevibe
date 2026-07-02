<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Models\Concerns\HasUuid;

class Plateforme extends Model
{
    use HasFactory, HasUuid;

    protected $fillable = [
        'nom',
    ];

    public function jeux(): BelongsToMany
    {
        return $this->belongsToMany(Jeu::class, 'jeu_plateforme');
    }
}
