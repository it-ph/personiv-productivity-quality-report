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
		<th colspan="3" center></th>
		@foreach($reports as $item)
			<th colspan="2">{{ $item->date_start_formatted }} to {{ $item->date_end_formatted }}</th>
		@endforeach
	</tr>
	<tr>
		<th>Name</th>
		<th>Position</th>
		<th>Category</th>
		@foreach($reports as $item)
			<th>Productivity</th>
			<th>Quality</th>
		@endforeach
		<th>Productivity Average</th>
		<th>Quality Average</th>
		<th>Remarks</th>
	</tr>
	@foreach($members as $key => $item)
		<tr>
			<td>{{ $item->full_name }}</td>
			<td>{{ $item->position }}</td>
			<td>{{ $item->experience }}</td>
			
			@foreach($item->results as $average)
				<td>{{ $average->productivity }}%</td>
				<td>{{ $average->quality }}%</td>
			@endforeach

			<td>{{ $item->productivity_average }}%</td>
			<td>{{ $item->quality_average }}%</td>
			<td>{{ $item->quota }}</td>
		</tr>
	@endforeach
</table>
