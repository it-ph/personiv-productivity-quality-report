<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
	use SoftDeletes;
    protected $dates = ['deleted_at'];

    public function department()
    {
    	return $this->belongsTo('App\Department');
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

    public function reports()
    {
    	return $this->hasMany('App\Report');
    }

    public function positions()
    {
        return $this->hasMany('App\Position');
    }
}
