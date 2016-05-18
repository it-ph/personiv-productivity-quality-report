<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Report extends Model
{
    use SoftDeletes;
    protected $dates = ['deleted_at'];

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

    public function department()
    {
    	return $this->belongsTo('App\Department');
    }

    public function project()
    {
    	return $this->belongsTo('App\Project');
    }

    public function team_leader()
    {
    	return $this->belongsTo('App\User');
    }

    public function results()
    {
    	return $this->hasMany('App\Result');
    }

    public function approvals()
    {
    	return $this->hasMany('App\Approvals');
    }

    public function targets()
    {
        return $this->hasManyThrough('App\Target', 'App\Project');
    }
}
