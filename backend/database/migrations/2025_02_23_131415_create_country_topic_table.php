<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('country_topic', function (Blueprint $table) {
            $table->id();
            $table->foreignId('country_id')->constrained()->onDelete('cascade');
            $table->foreignId('topic_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            
            // Đảm bảo một country không thể thuộc về một topic nhiều lần
            $table->unique(['country_id', 'topic_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('country_topic');
    }
}; 