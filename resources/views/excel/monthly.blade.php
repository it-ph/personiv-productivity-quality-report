<table>
	<tr>
		<th align="center" colspan="4">Targets</th>
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
		<th align="center" colspan="3" center></th>
		@foreach($reports as $item)
			<th align="center" colspan="2">{{ $item->date_start_formatted }} to {{ $item->date_end_formatted }}</th>
		@endforeach
	</tr>
	<tr>
		<th align="center">Name</th>
		<th align="center">Position</th>
		<th align="center">Category</th>
		@foreach($reports as $item)
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
	@foreach($members as $key => $item)
		<tr>
			<td align="center">{{ $item->full_name }}</td>
			<td align="center">{{ $item->position }}</td>
			<td align="center">{{ $item->experience }}</td>
			
			@foreach($item->results as $result)
				<td align="center">{{ round($result->productivity,1) }}%</td>
				<td align="center">{{ round($result->quality,1) }}%</td>
			@endforeach
			
			<td align="center">{{ $item->total_output }}</td>
			<td align="center">{{ $item->total_output_error }}</td>
			<td align="center">{{ $item->total_hours_worked }}</td>
			<td align="center">{{ $item->productivity_average }}%</td>
			<td align="center">{{ $item->quality_average }}%</td>
			<td align="center">{{ $item->quadrant }}</td>
		</tr>
	@endforeach
</table>
