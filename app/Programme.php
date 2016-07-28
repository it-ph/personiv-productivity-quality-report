<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Programme extends Model
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
}
