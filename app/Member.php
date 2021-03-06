<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Member extends Model
{
	use SoftDeletes;
    protected $dates = ['deleted_at'];

    public function experiences()
    {
        return $this->hasMany('App\Experience');
    }

    public function department()
    {
    	return $this->belongsTo('App\Department');
    }

    public function performances()
    {
    	return $this->hasMany('App\Performance');
    }

    public function project()
    {
        return $this->hasManyThrough('App/Project', 'App/Performance');
    }
}
