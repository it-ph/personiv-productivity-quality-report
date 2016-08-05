<table>
	<tr>
		<th align="center">Position</th>
		<th align="center">Head Count</th>
	</tr>
	@foreach($project->positions as $position)
		<tr>
			<td align="center">{{$position->name}}</td>
			<td align="center">{{$position->head_count}}</td>
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
		<th align="center">{{$project->beginner_total_output}}</th>
		<th align="center">{{$project->beginner_total_hours_worked}}</th>
		<th align="center">{{$project->beginner_total_average_output}}</th>
	</tr>
	@foreach($project->positions as $position)
		@if($position->beginner_total_output && $position->beginner_total_hours_worked && $position->beginner_total_average_output)
			<tr>
				<td align="center">{{$position->name}}</td>
				<td align="center">{{$position->beginner_total_output}}</td>
				<td align="center">{{$position->beginner_total_hours_worked}}</td>
				<td align="center">{{$position->beginner_total_average_output}}</td>
			</tr>
		@endif
	@endforeach
	<tr>
		<th align="center">Moderately Experienced</th>
		<th align="center">{{$project->moderately_experienced_total_output}}</th>
		<th align="center">{{$project->moderately_experienced_total_hours_worked}}</th>
		<th align="center">{{$project->moderately_experienced_total_average_output}}</th>
	</tr>
	@foreach($project->positions as $position)
		@if($position->moderately_experienced_total_output && $position->moderately_experienced_total_hours_worked && $position->moderately_experienced_total_average_output)
			<tr>
				<td align="center">{{$position->name}}</td>
				<td align="center">{{$position->moderately_experienced_total_output}}</td>
				<td align="center">{{$position->moderately_experienced_total_hours_worked}}</td>
				<td align="center">{{$position->moderately_experienced_total_average_output}}</td>
			</tr>
		@endif
	@endforeach
	<tr>
		<th align="center">Experienced</th>
		<th align="center">{{$project->experienced_total_output}}</th>
		<th align="center">{{$project->experienced_total_hours_worked}}</th>
		<th align="center">{{$project->experienced_total_average_output}}</th>
	</tr>
	@foreach($project->positions as $position)
		<tr>
			<td align="center">{{$position->name}}</td>
			<td align="center">{{$position->total_output}}</td>
			<td align="center">{{$position->total_hours_worked}}</td>
			<td align="center">{{$position->total_average_output}}</td>
		</tr>
	@endforeach
	<tr>
		<th align="center">Grand Total</th>
		<th align="center">{{$project->total_output}}</th>
		<th align="center">{{$project->total_hours_worked}}</th>
		<th align="center">{{$project->total_average_output}}</th>
	</tr>
</table>