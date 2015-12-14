<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePerformancesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('performances', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('member_id');
            $table->date('date_start');
            $table->date('date_end');
            $table->integer('daily_work_hours');
            $table->integer('output');
            $table->integer('hours_worked');
            $table->integer('output_error');
            $table->integer('average_output');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('performances');
    }
}
