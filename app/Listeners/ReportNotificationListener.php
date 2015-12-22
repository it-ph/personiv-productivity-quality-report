<?php

namespace App\Listeners;

use App\Events\ReportSubmittedBroadCast;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class ReportNotificationListener
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  ReportSubmittedBroadCast  $event
     * @return void
     */
    public function handle(ReportSubmittedBroadCast $event)
    {
        //
    }
}
