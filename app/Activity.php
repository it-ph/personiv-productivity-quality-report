<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    public function report()
    {
    	return $this->belongsTo('App\Report');
    }

    public function user()
    {
    	return $this->belongsTo('App\User');
    }

    public function activity_type()
    {
    	return $this->belongsTo('App\ActivityType');
    }
}
