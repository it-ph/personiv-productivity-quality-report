<table>
	<tr>
		<th colspan="4">Targets</th>
	</tr>
	<!-- Headers -->
	<tr>
		<th>Productivity</th>
		@foreach($positions as $item)
			<th>{{ $item->name }}</th>
		@endforeach
	</tr>
	<!-- Beginner -->
	<tr>
		<td>Beginner (less than 3 months)</td>
		@foreach($beginner as $item)
			<td>{{ $item->value }}</td>
		@endforeach
	</tr>
	<!-- Moderately Experienced -->
	<tr>
		<td>Moderately Experienced (3 to 6 months)</td>
		@foreach($moderately_experienced as $item)
			<td>{{ $item->value }}</td>
		@endforeach
	</tr>
	<!-- Experienced -->
	<tr>
		<td>Experienced (6 months and beyond)</td>
		@foreach($experienced as $item)
			<td>{{ $item->value }}</td>
		@endforeach
	</tr>
	<tr>
		<td colspan="4"></td>
	</tr>
	<tr>
		<th>Quality</th>
		@foreach($quality as $item)
			<td>{{ $item->value }}%</td>
		@endforeach
	</tr>
</table>
<br>
<table>
	<tr>
		<th>Name</th>
		<th>Position</th>
		<th>Experience</th>
		<th>Daily Work Hours</th>
		<th>Hours Worked</th>
		<th>Output</th>
		<th>Output w/Error(s)</th>
		<th>Average Output</th>
		<th>Productivity</th>
		<th>Quality</th>
	</tr>

	@foreach($data as $item)
		<tr>
			<td>{{ $item->full_name }}</td>
			<td>{{ $item->position }}</td>
			<td>{{ $item->experience }}</td>
			<td>{{ round($item->daily_work_hours, 1) }}</td>
			<td>{{ round($item->hours_worked, 1) }}</td>
			<td>{{ round($item->output, 1) }}</td>
			<td>{{ round($item->output_error, 1) }}</td>
			<td>{{ round($item->average_output, 1) }}</td>
			<td>{{ round($item->productivity, 1) }}%</td>
			<td>{{ round($item->quality, 1) }}%</td>
		</tr>
	@endforeach
</table>