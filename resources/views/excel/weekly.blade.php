<table>
	<tr>
		<th colspan="4" align="center">Targets</th>
	</tr>
	<!-- Headers -->
	<tr>
		<th align="center">Productivity</th>
		@foreach($positions as $item)
			<th align="center">{{ $item->name }}</th>
		@endforeach
	</tr>
	<!-- Beginner -->
	<tr>
		<td align="center">Beginner (less than 3 months)</td>
		@foreach($beginner as $item)
			<td align="center">{{ $item->value }}</td>
		@endforeach
	</tr>
	<!-- Moderately Experienced -->
	<tr>
		<td align="center">Moderately Experienced (3 to 6 months)</td>
		@foreach($moderately_experienced as $item)
			<td align="center">{{ $item->value }}</td>
		@endforeach
	</tr>
	<!-- Experienced -->
	<tr>
		<td align="center">Experienced (6 months and beyond)</td>
		@foreach($experienced as $item)
			<td align="center">{{ $item->value }}</td>
		@endforeach
	</tr>
	<tr>
		<td align="center" colspan="4"></td>
	</tr>
	<tr>
		<th align="center">Quality</th>
		@foreach($quality as $item)
			<td align="center">{{ $item->value }}%</td>
		@endforeach
	</tr>
</table>
<br>
<table>
	<tr>
		<th align="center">Name</th>
		<th align="center">Position</th>
		<th align="center">Experience</th>
		<th align="center">Daily Work Hours</th>
		<th align="center">Hours Worked</th>
		<th align="center">Output</th>
		<th align="center">Output w/Error(s)</th>
		<th align="center">Average Output</th>
		<th align="center">Productivity</th>
		<th align="center">Quality</th>
		<th align="center">Quadrant</th>
	</tr>

	@foreach($data as $item)
		<tr>
			<td align="center">{{ $item->full_name }}</td>
			<td align="center">{{ $item->position }}</td>
			<td align="center">{{ $item->experience }}</td>
			<td align="center">{{ round($item->daily_work_hours, 1) }}</td>
			<td align="center">{{ round($item->hours_worked, 1) }}</td>
			<td align="center">{{ round($item->output, 1) }}</td>
			<td align="center">{{ round($item->output_error, 1) }}</td>
			<td align="center">{{ round($item->average_output, 1) }}</td>
			<td align="center">{{ round($item->productivity, 1) }}%</td>
			<td align="center">{{ round($item->quality, 1) }}%</td>
			<td align="center">{{ $item->quadrant }}</td>
		</tr>
	@endforeach
</table>