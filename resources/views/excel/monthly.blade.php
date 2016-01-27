<table>
	<tr>
		<th colspan="3" center></th>
		@foreach($data as $item)
			<th colspan="2">{{ $item->date_start }} to {{ $item->date_end }}</th>
		@endforeach
	</tr>
	<tr>
		<th>Name</th>
		<th>Position</th>
		<th>Experience</th>
		@foreach($data as $item)
			<th>Productivity</th>
			<th>Quality</th>
		@endforeach
		<th>Last 4 weeks Productivity Average</th>
		<th>Last 4 weeks Quality Average</th>
	</tr>
	@foreach($data as $item)
		<tr>
			<td>{{ $item->full_name }}</td>
			<td>{{ $item->position }}</td>
			<td>{{ $item->experience }}</td>
			
			@foreach($data as $item)
				<td>{{ $item->productivity }}%</td>
				<td>{{ $item->quality }}%</td>
			@endforeach
			
			<td>{{ $productivity_average }}%</td>
			<td>{{ $quality_average }}%</td>
		</tr>
	@endforeach
</table>
