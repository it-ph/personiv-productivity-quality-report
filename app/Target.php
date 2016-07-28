<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Target extends Model
{
    use SoftDeletes;
    protected $dates = ['deleted_at'];
    
    public function department()
    {
    	return $this->belongsTo('App\Department');
    }

    public function project()
    {
    	return $this->belongsTo('App\Project');
    }

    public function position()
    {
    	return $this->belongsTo('App\Department');
    }

    public function performances()
    {
        return $this->hasMany('App\Performance');
    }
}
