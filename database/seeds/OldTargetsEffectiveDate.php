<?php

use Illuminate\Database\Seeder;
use App\Target;
use Carbon\Carbon;

class OldTargetsEffectiveDate extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::transaction(function(){
            $targets = Target::onlyTrashed()->get();

            foreach($targets as $target) {
                $target->effective_date = Carbon::parse($target->created_at);
                $target->save();
            }
        });
    }
}
