
<table>
	<tr>
		<th colspan="3" center></th>
		@foreach($reports as $item)
			<th colspan="2">{{ $item->date_start }} to {{ $item->date_end }}</th>
		@endforeach
	</tr>
	<tr>
		<th>Name</th>
		<th>Position</th>
		<th>Experience</th>
		@foreach($reports as $item)
			<th>Productivity</th>
			<th>Quality</th>
		@endforeach
		<th>Last 4 weeks Productivity Average</th>
		<th>Last 4 weeks Quality Average</th>
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
		</tr>
	@endforeach
</table>
