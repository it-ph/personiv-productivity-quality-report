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
			<td align="center">{{ $beginner->productivity }}</td>
		@endforeach
	</tr>
	<!-- Moderately Experienced -->
	<tr>
		<td align="center">Moderately Experienced (3 to 6 months)</td>
		@foreach($project->moderately_experienced as $moderately_experienced)
			<td align="center">{{ $moderately_experienced->productivity }}</td>
		@endforeach
	</tr>
	<!-- Experienced -->
	<tr>
		<td align="center">Experienced (6 months and beyond)</td>
		@foreach($project->experienced as $experienced)
			<td align="center">{{ $experienced->productivity }}</td>
		@endforeach
	</tr>
	<tr>
		<td align="center" colspan="4"></td>
	</tr>
	<tr>
		<th align="center">Quality</th>
		@foreach($project->quality as $quality)
			<td align="center">{{ $quality->quality }}%</td>
		@endforeach
	</tr>
</table>
<br>
@foreach($project->positions as $position)
<table>
	<tr>
		<th>{{ $position->name }}</th>
		<th align="center" colspan="2"></th>
		@foreach($project->weeks as $week)
			<th colspan="2" align="center">{{ $week }}</th>
		@endforeach
	</tr>
	<tr>
		<th align="center">Name</th>
		<th align="center">Category</th>
		@foreach($project->weeks as $week)
			<th align="center">Productivity</th>
			<th align="center">Quality</th>
		@endforeach
		<th align="center">Total Output</th>
		<th align="center">Total Output Error</th>
		<th align="center">Total Hours Worked</th>
		<th align="center">Monthly Productivity</th>
		<th align="center">Monthly Quality</th>
		<th align="center">Quadrant</th>
	</tr>
	@foreach($project->weeks as $week_key => $week)
		@foreach($position->performances[$week_key] as $performance)
			<tr>
				<td align="center">{{ $performance->member->full_name }}</td>
				<td align="center">{{ $performance->member->experiences[0]->experience }}</td>
				
				<td align="center">{{ round($performance->productivity,1) }}%</td>
				<td align="center">{{ round($performance->quality,1) }}%</td>
			</tr>
		@endforeach
	@endforeach
</table>
@endforeach
