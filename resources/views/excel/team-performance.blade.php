<table>
	<tr>
		<th>Position</th>
		<th>Head Count</th>
	</tr>
	@foreach($details->positions as $item)
		<tr>
			<td>{{$item->name}}</td>
			<td>{{$item->head_count}}</td>
		</tr>
	@endforeach
</table>

<table>
	<tr>
		<th>Row Labels</th>
		<th>Sum of Total Output</th>
		<th>Sum of Total Man Hours</th>
		<th>Sum of Total Average Output</th>
	</tr>
	<tr>
		<th>Beginner</th>
		<td>{{$details->beginner_total_output}}</td>
		<td>{{$details->beginner_total_man_hours}}</td>
		<td>{{$details->beginner_total_average_output}}</td>
	</tr>
	@foreach($details->beginner as $item)
		<tr>
			<td>{{$item->position}}</td>
			<td>{{$item->total_output}}</td>
			<td>{{$item->total_man_hours}}</td>
			<td>{{$item->total_average_output}}</td>
		</tr>
	@endforeach
	<tr>
		<th>Moderately Experienced</th>
		<td>{{$details->moderately_experienced_total_output}}</td>
		<td>{{$details->moderately_experienced_total_man_hours}}</td>
		<td>{{$details->moderately_experienced_total_average_output}}</td>
	</tr>
	@foreach($details->moderately_experienced as $item)
		<tr>
			<td>{{$item->position}}</td>
			<td>{{$item->total_output}}</td>
			<td>{{$item->total_man_hours}}</td>
			<td>{{$item->total_average_output}}</td>
		</tr>
	@endforeach
	<tr>
		<th>Experienced</th>
		<td>{{$details->experienced_total_output}}</td>
		<td>{{$details->experienced_total_man_hours}}</td>
		<td>{{$details->experienced_total_average_output}}</td>
	</tr>
	@foreach($details->experienced as $item)
		<tr>
			<td>{{$item->position}}</td>
			<td>{{$item->total_output}}</td>
			<td>{{$item->total_man_hours}}</td>
			<td>{{$item->total_average_output}}</td>
		</tr>
	@endforeach
	<tr>
		<th>Grand Total</th>
		<th>{{$details->overall_total_output}}</th>
		<th>{{$details->overall_total_man_hours}}</th>
		<th>{{$details->overall_total_average_output}}</th>
	</tr>
</table>