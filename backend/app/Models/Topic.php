<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Topic extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'image', 
        'description', 
        'start_date', 
        'end_date', 
        'is_active'
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function votes()
    {
        return $this->hasMany(Vote::class);
    }

    public function isActive(): bool
    {
        return $this->is_active && $this->start_date <= now() && $this->end_date >= now();
    }
}
