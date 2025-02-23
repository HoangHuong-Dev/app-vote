<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Club extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 
        'logo', 
        'image',
        'country_id', 
        'description',
        'votes_count',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'votes_count' => 'integer'
    ];

    public function country()
    {
        return $this->belongsTo(Country::class);
    }

    public function votes()
    {
        return $this->hasMany(Vote::class);
    }
}
