<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Topic extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'image',
        'start_date',
        'end_date',
        'is_active'
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'is_active' => 'boolean'
    ];

    protected $appends = ['image_url'];

    public function votes()
    {
        return $this->hasMany(Vote::class);
    }

    public function countries()
    {
        return $this->belongsToMany(Country::class, 'country_topic');
    }

    public function clubs()
    {
        return $this->hasManyThrough(
            Club::class,
            Country::class,
            'id', // Foreign key on country_topic table...
            'country_id', // Foreign key on clubs table...
            'id', // Local key on topics table...
            'id' // Local key on countries table...
        );
    }

    public function isActive()
    {
        return $this->is_active && 
               now()->between($this->start_date, $this->end_date);
    }

    public function getImageUrlAttribute()
    {
        return url($this->image);
    }
}
