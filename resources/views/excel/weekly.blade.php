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