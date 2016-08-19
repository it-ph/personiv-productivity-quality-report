<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ActivityType extends Model
{
    public function activities()
    {
    	return $this->hasMany('App\Activity')
    }
}
