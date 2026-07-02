<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;
use App\Models\Jeu;
use App\Models\Concerns\HasUuid;

class Avis extends Model
{
    use HasFactory, HasUuid;

    protected $fillable = [
        'user_id',
        'jeu_id',
        'note',
        'commentaire',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function jeu(): BelongsTo
    {
        return $this->belongsTo(Jeu::class);
    }
}
