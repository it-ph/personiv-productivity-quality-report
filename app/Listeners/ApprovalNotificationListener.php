<?php

namespace App\Listeners;

use App\Events\ApprovalNotificationBroadCast;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class ApprovalNotificationListener
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
     * @param  ApprovalNotificationBroadCast  $event
     * @return void
     */
    public function handle(ApprovalNotificationBroadCast $event)
    {
        //
    }
}
