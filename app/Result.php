<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Result extends Model
{
    use SoftDeletes;
    protected $dates = ['deleted_at'];

    public function performance()
    {
    	return $this->belongsTo('App\Performance');
    }

    public function report()
    {
    	return $this->belongsTo('App\Report');
    }
}
