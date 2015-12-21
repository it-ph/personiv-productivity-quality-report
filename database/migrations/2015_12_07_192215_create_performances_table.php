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
            $table->integer('report_id');
            $table->integer('member_id');
            $table->integer('position_id');
            $table->integer('department_id');
            $table->integer('project_id');
            $table->date('date_start');
            $table->date('date_end');
            $table->float('daily_work_hours');
            $table->integer('output');
            $table->float('hours_worked');
            $table->integer('output_error');
            $table->float('average_output');
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
