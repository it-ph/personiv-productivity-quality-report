<table>
	<tr>
		<th align="center">{{ $member->full_name}}</th>
	</tr>
	<tr>
		<th align="center">Average Productivity:</th>
		<th align="center">{{ round($project->average_productivity,2) }}%</th>
	</tr>
	<tr>
		<th align="center">Average Quality:</th>
		<th align="center">{{ round($project->average_quality,2) }}%</th>
	</tr>
</table>
@foreach($project->positions as $position)
	<table>
		@if(count($position->performances))
			<tr>
				<th align="center">{{ $position->name }}</th>
			</tr>
			<tr>
				<th align="center">Date Start</th>
				<th align="center">Date End</th>
				<th align="center">Daily Work Hours</th>
				<th align="center">Hours Worked</th>
				<th align="center">Output</th>
				<th align="center">Output w/Error(s)</th>
				<th align="center">Average Output</th>
				<th align="center">Productivity</th>
				<th align="center">Quality</th>
				<th align="center">Quadrant</th>
				<th align="center">Remarks</th>
			</tr>
			@foreach($position->performances as $performance)
				<tr>
					<td align="center">{{ $performance->date_start }}</td>
					<td align="center">{{ $performance->date_end }}</td>
					<td align="center">{{ round($performance->daily_work_hours, 1) }}</td>
					<td align="center">{{ round($performance->hours_worked, 2) }}</td>
					<td align="center">{{ round($performance->output, 2) }}</td>
					<td align="center">{{ round($performance->output_error, 2) }}</td>
					<td align="center">{{ round($performance->average_output, 2) }}</td>
					<td align="center">{{ round($performance->productivity ,2) }}%</td>
					<td align="center">{{ round($performance->quality,2) }}%</td>
					<td align="center">{{ $performance->quadrant }}</td>
					<td align="center">{{ $performance->remarks }}</td>
				</tr>
			@endforeach
			<tr>
				<th align="center" colspan="3"></th>
				<th align="center">Total Hours Worked</th>
				<th align="center">Total Output</th>
				<th align="center">Total Output w/Error(s)</th>
				<th align="center">Total Average Output</th>
				<th align="center">Productivity</th>
				<th align="center">Quality</th>
				<th align="center">Quadrant</th>
			</tr>
			<tr>
				<td align="center" colspan="3"></td>
				<td align="center">{{ round($position->total_hours_worked, 2) }}</td>
				<td align="center">{{ round($position->total_output, 2) }}</td>
				<td align="center">{{ round($position->total_output_error, 2) }}</td>
				<td align="center">{{ round($position->total_average_output, 2) }}</td>
				<td align="center">{{ round($position->productivity,2) }}%</td>
				<td align="center">{{ round($position->quality,2) }}%</td>
				<td align="center">{{ $position->quadrant }}</td>
			</tr>
		@endif
	</table>
@endforeach
