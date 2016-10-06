<table>
	<tr>
		<th colspan="{{count($project->positions) + 1}}" align="center">Targets</th>
	</tr>
	<!-- Headers -->
	<tr>
		<th align="center">Productivity</th>
		@foreach($project->positions as $position)
			<th align="center">{{ $position->name }}</th>
		@endforeach
	</tr>
	<!-- Beginner -->
	<tr>
		<td align="center">Beginner (less than 3 months)</td>
		@foreach($project->beginner as $beginner)
			<td align="center">{{ round($beginner->productivity, 2) }}</td>
		@endforeach
	</tr>
	<!-- Moderately Experienced -->
	<tr>
		<td align="center">Moderately Experienced (3 to 6 months)</td>
		@foreach($project->moderately_experienced as $moderately_experienced)
			<td align="center">{{ round($moderately_experienced->productivity, 2) }}</td>
		@endforeach
	</tr>
	<!-- Experienced -->
	<tr>
		<td align="center">Experienced (6 months and beyond)</td>
		@foreach($project->experienced as $experienced)
			<td align="center">{{ round($experienced->productivity, 2) }}</td>
		@endforeach
	</tr>
	<tr>
		<td align="center" colspan="4"></td>
	</tr>
	<tr>
		<th align="center">Quality</th>
		@foreach($project->quality as $quality)
			<td align="center">{{ round($quality->quality, 2) }}%</td>
		@endforeach
	</tr>
</table>
<br>
@foreach($project->positions as $position)
<table>
	<tr>
		<th align="center" colspan="2"></th>
		@foreach($project->weeks as $week)
			<th colspan="3" align="center">{{ $week }}</th>
		@endforeach
	</tr>
	<tr>
		<th align="center">{{ $position->name }}</th>
		<th align="center">Category</th>
		@foreach($project->weeks as $week)
			<th align="center">Productivity</th>
			<th align="center">Quality</th>
			<th align="center">Remarks</th>
		@endforeach
		<th align="center">Total Output</th>
		<th align="center">Total Output Error</th>
		<th align="center">Total Hours Worked</th>
		<th align="center">Monthly Productivity</th>
		<th align="center">Monthly Quality</th>
		<th align="center">Quadrant</th>
	</tr>
	@foreach($position->members as $member)
		<tr>
			<td align="center">{{ $member->full_name }}</td>
			<td align="center">{{ $member->experience->experience }}</td>
			@foreach($project->weeks as $week_key => $week)
				<td align="center">{{ round($member->performances[$week_key]->productivity,2) }}%</td>
				<td align="center">{{ round($member->performances[$week_key]->quality,2) }}%</td>
				<td align="center">{{ $member->performances[$week_key]->remarks or ''}}</td>
			@endforeach
			<td align="center">{{ round($member->total_output,2) }}</td>
			<td align="center">{{ round($member->total_output_error,2) }}</td>
			<td align="center">{{ round($member->total_hours_worked,2) }}</td>
			<td align="center">{{ round($member->monthly_productivity,2) }}%</td>
			<td align="center">{{ round($member->monthly_quality,2) }}%</td>
			<td align="center">{{ $member->quadrant }}</td>
		</tr>
	@endforeach
</table>
@endforeach
