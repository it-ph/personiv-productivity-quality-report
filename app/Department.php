<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Department extends Model
{
    protected $dates = ['deleted_at'];

    public function users()
    {
    	return $this->hasMany('App\User');
    }

    public function positions()
    {
    	return $this->hasMany('App\Position');
    }

    public function projects()
    {
    	return $this->hasMany('App\Project');
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

    public function members()
    {
    	return $this->hasMany('App\Member');
    }
}
