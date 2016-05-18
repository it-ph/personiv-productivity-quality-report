<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Position extends Model
{
    public function department()
    {
    	return $this->belongsTo('App\Department');
    }

    public function project()
    {
    	return $this->belongsTo('App\Project');
    }

    public function targets()
    {
    	return $this->hasMany('App\Target');
    }

    public function performances()
    {
    	return $this->hasMany('App\Performance');
    }

    public function performance_approvals()
    {
    	return $this->hasMany('App\PerformanceApproval');
    }

    public function performance_histories()
    {
    	return $this->hasMany('App\PerformanceHistory');
    }
}
