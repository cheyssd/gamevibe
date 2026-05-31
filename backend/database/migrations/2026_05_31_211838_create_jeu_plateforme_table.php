<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('jeu_plateforme', function (Blueprint $table) {
            $table->foreignId('jeu_id')
                ->constrained('jeux')
                ->onDelete('cascade');
            $table->foreignId('plateforme_id')
                ->constrained('plateformes')
                ->onDelete('cascade');
            $table->primary(['jeu_id', 'plateforme_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jeu_plateforme');
    }
};
