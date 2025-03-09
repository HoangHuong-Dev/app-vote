<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 
        'code', 
        'flag',
        'image',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean'
    ];

    public function clubs()
    {
        return $this->hasMany(Club::class);
    }

    public function topics()
    {
        return $this->belongsToMany(Topic::class, 'country_topic');
    }

    public function cities()
    {
        return $this->hasMany(City::class);
    }
}
