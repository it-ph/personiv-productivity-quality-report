<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Target extends Model
{
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
}
