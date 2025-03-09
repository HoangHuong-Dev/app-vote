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
            City::class,
            'country_id', // khóa ngoại trên cities phù hợp với các quốc gia từ relationship countries
            'city_id', // khóa ngoại trên clubs
            'id', // ID của topics
            'id' // ID của cities
        )->whereHas('city.country', function($query) {
            $query->whereIn('countries.id', $this->countries->pluck('id')->toArray());
        });
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
