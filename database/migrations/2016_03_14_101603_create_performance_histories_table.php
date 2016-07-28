<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePerformanceHistoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('performance_histories', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('performance_id');
            $table->integer('report_id');
            // $table->integer('result_id')->nullable();
            $table->integer('member_id');
            $table->integer('position_id');
            $table->integer('department_id');
            $table->integer('project_id');
            $table->integer('target_id');
            // $table->integer('programme_id');
            $table->dateTime('date_start');
            $table->dateTime('date_end');
            $table->float('daily_work_hours');
            $table->float('output');
            $table->float('hours_worked');
            $table->float('output_error');
            $table->float('average_output');
            $table->float('productivity');
            $table->float('quality');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('performance_histories');
    }
}
