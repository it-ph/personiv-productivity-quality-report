<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Performance extends Model
{
    use SoftDeletes;
    protected $dates = ['deleted_at'];

    public function department()
    {
    	return $this->belongsTo('App\Department');
    }

	public function member()
    {
    	return $this->belongsTo('App\Member');
    }

    public function position()
    {
    	return $this->belongsTo('App\Position');
    }

    public function project()
    {
    	return $this->belongsTo('App\Project');
    }

    public function report()
    {
    	return $this->belongsTo('App\Report');
    }

    public function result()
    {
    	return $this->belongsTo('App\Result');
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
