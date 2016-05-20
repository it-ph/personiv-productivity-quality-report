<table>
	<tr>
		<th align="center">Position</th>
		<th align="center">Head Count</th>
	</tr>
	@foreach($details->positions as $item)
		<tr>
			<td align="center">{{$item->name}}</td>
			<td align="center">{{$item->head_count}}</td>
		</tr>
	@endforeach
</table>

<table>
	<tr>
		<th align="center">Row Labels</th>
		<th align="center">Sum of Total Output</th>
		<th align="center">Sum of Total Man Hours</th>
		<th align="center">Sum of Total Average Output</th>
	</tr>
	<tr>
		<th align="center">Beginner</th>
		<td align="center">{{$details->beginner_total_output}}</td>
		<td align="center">{{$details->beginner_total_man_hours}}</td>
		<td align="center">{{$details->beginner_total_average_output}}</td>
	</tr>
	@foreach($details->beginner as $item)
		<tr>
			<td align="center">{{$item->position}}</td>
			<td align="center">{{$item->total_output}}</td>
			<td align="center">{{$item->total_man_hours}}</td>
			<td align="center">{{$item->total_average_output}}</td>
		</tr>
	@endforeach
	<tr>
		<th align="center">Moderately Experienced</th>
		<td align="center">{{$details->moderately_experienced_total_output}}</td>
		<td align="center">{{$details->moderately_experienced_total_man_hours}}</td>
		<td align="center">{{$details->moderately_experienced_total_average_output}}</td>
	</tr>
	@foreach($details->moderately_experienced as $item)
		<tr>
			<td align="center">{{$item->position}}</td>
			<td align="center">{{$item->total_output}}</td>
			<td align="center">{{$item->total_man_hours}}</td>
			<td align="center">{{$item->total_average_output}}</td>
		</tr>
	@endforeach
	<tr>
		<th align="center">Experienced</th>
		<td align="center">{{$details->experienced_total_output}}</td>
		<td align="center">{{$details->experienced_total_man_hours}}</td>
		<td align="center">{{$details->experienced_total_average_output}}</td>
	</tr>
	@foreach($details->experienced as $item)
		<tr>
			<td align="center">{{$item->position}}</td>
			<td align="center">{{$item->total_output}}</td>
			<td align="center">{{$item->total_man_hours}}</td>
			<td align="center">{{$item->total_average_output}}</td>
		</tr>
	@endforeach
	<tr>
		<th align="center">Grand Total</th>
		<th align="center">{{$details->overall_total_output}}</th>
		<th align="center">{{$details->overall_total_man_hours}}</th>
		<th align="center">{{$details->overall_total_average_output}}</th>
	</tr>
</table>