<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Jeu;
use App\Models\Concerns\HasUuid;


class Developpeur extends Model
{
    use HasFactory, HasUuid;

    protected $fillable = [
        'nom',
    ];

    public function jeux(): HasMany
    {
        return $this->hasMany(Jeu::class);
    }
}
