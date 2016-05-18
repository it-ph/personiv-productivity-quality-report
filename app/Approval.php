<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Approval extends Model
{
    use SoftDeletes;
    protected $dates = ['deleted_at'];

    public function performance_approvals()
    {
    	return $this->hasMany('App\PerformanceApproval');
    }

    public function report()
    {
    	return $this->belongsTo('App\Report');
    }
}
