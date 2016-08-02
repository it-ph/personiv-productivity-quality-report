<table>
	<tr>
		<th colspan="{{count($project->department->beginner) + 1}}" align="center">Targets</th>
	</tr>
	<!-- Headers -->
	<tr>
		<th align="center">Productivity</th>
		@foreach($project->reports[0]->project->positions as $position)
			<th align="center">{{ $position->name }}</th>
		@endforeach
	</tr>
	<!-- Beginner -->
	<tr>
		<td align="center">Beginner (less than 3 months)</td>
		@foreach($project->department->beginner as $beginner)
			<td align="center">{{ $beginner->productivity }}</td>
		@endforeach
	</tr>
	<!-- Moderately Experienced -->
	<tr>
		<td align="center">Moderately Experienced (3 to 6 months)</td>
		@foreach($project->department->moderately_experienced as $moderately_experienced)
			<td align="center">{{ $moderately_experienced->productivity }}</td>
		@endforeach
	</tr>
	<!-- Experienced -->
	<tr>
		<td align="center">Experienced (6 months and beyond)</td>
		@foreach($project->department->experienced as $experienced)
			<td align="center">{{ $experienced->productivity }}</td>
		@endforeach
	</tr>
	<tr>
		<td align="center" colspan="4"></td>
	</tr>
	<tr>
		<th align="center">Quality</th>
		@foreach($project->department->quality as $quality)
			<td align="center">{{ $quality->quality }}%</td>
		@endforeach
	</tr>
</table>
<br>
<table>
	<tr>
		<th align="center">Name</th>
		<th align="center">Position</th>
		<th align="center">Category</th>
		<th align="center">Daily Work Hours</th>
		<th align="center">Hours Worked</th>
		<th align="center">Output</th>
		<th align="center">Output w/Error(s)</th>
		<th align="center">Average Output</th>
		<th align="center">Productivity</th>
		<th align="center">Quality</th>
		<th align="center">Quadrant</th>
	</tr>

	@foreach($project->reports as $report)
		@foreach($report->performances as $performance)
			<tr>
				<td align="center">{{ $performance->member->full_name }}</td>
				<td align="center">{{ $performance->position->name }}</td>
				<td align="center">{{ $performance->experience }}</td>
				<td align="center">{{ round($performance->daily_work_hours, 1) }}</td>
				<td align="center">{{ round($performance->hours_worked, 1) }}</td>
				<td align="center">{{ round($performance->output, 1) }}</td>
				<td align="center">{{ round($performance->output_error, 1) }}</td>
				<td align="center">{{ round($performance->average_output, 1) }}</td>
				<td align="center">{{ round($performance->productivity, 1) }}%</td>
				<td align="center">{{ round($performance->quality, 1) }}%</td>
				<td align="center">{{ $performance->quadrant }}</td>
			</tr>
		@endforeach
	@endforeach
</table>