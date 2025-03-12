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
        'city_id', 
        'description',
        'votes_count',
        'is_active',
        'latitude',
        'longitude'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'votes_count' => 'integer'
    ];

    public function city()
    {
        return $this->belongsTo(City::class);
    }

    public function votes()
    {
        return $this->hasMany(Vote::class);
    }
}
