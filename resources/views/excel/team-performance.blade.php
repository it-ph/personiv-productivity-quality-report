<table>
	<tr>
		<th align="center">Position</th>
		<th align="center">Beginner</th>
		<th align="center">Moderately Experienced</th>
		<th align="center">Experienced</th>
		<th align="center">Head Count</th>
	</tr>
	@foreach($project->positions as $position)
		<tr>
			<td align="center">{{$position->name}}</td>
			<td align="center">{{$position->beginner}}</td>
			<td align="center">{{$position->moderately_experienced}}</td>
			<td align="center">{{$position->experienced}}</td>
			<th align="center">{{$position->head_count}}</th>
		</tr>
	@endforeach
</table>

<table>
	<tr>
		<th align="center">Row Labels</th>
		<th align="center">Sum of Total Output</th>
		<th align="center">Sum of Total Man Hours</th>
		<th align="center">Total Average Output</th>
		<th align="center">Productivity Met</th>
	</tr>
	<tr>
		<th align="center">Beginner</th>
		<th align="center">{{round($project->beginner_total_output,2)}}</th>
		<th align="center">{{round($project->beginner_total_hours_worked,2)}}</th>
		<th align="center">{{round($project->beginner_total_average_output,2)}}</th>
	</tr>
	@foreach($project->positions as $position)
		@if($position->beginner_total_output && $position->beginner_total_hours_worked && $position->beginner_total_average_output)
			<tr>
				<td align="center">{{$position->name}}</td>
				<td align="center">{{round($position->beginner_total_output,2)}}</td>
				<td align="center">{{round($position->beginner_total_hours_worked,2)}}</td>
				<td align="center">{{round($position->beginner_total_average_output,2)}}</td>
				<td align="center">{{round($position->beginner_productivity_met,2)}}</td>
			</tr>
		@endif
	@endforeach
	<tr>
		<th align="center">Moderately Experienced</th>
		<th align="center">{{round($project->moderately_experienced_total_output,2)}}</th>
		<th align="center">{{round($project->moderately_experienced_total_hours_worked,2)}}</th>
		<th align="center">{{round($project->moderately_experienced_total_average_output,2)}}</th>
	</tr>
	@foreach($project->positions as $position)
		@if($position->moderately_experienced_total_output && $position->moderately_experienced_total_hours_worked && $position->moderately_experienced_total_average_output)
			<tr>
				<td align="center">{{$position->name}}</td>
				<td align="center">{{round($position->moderately_experienced_total_output,2)}}</td>
				<td align="center">{{round($position->moderately_experienced_total_hours_worked,2)}}</td>
				<td align="center">{{round($position->moderately_experienced_total_average_output,2)}}</td>
				<td align="center">{{round($position->moderately_experienced_productivity_met,2)}}</td>
			</tr>
		@endif
	@endforeach
	<tr>
		<th align="center">Experienced</th>
		<th align="center">{{round($project->experienced_total_output,2)}}</th>
		<th align="center">{{round($project->experienced_total_hours_worked,2)}}</th>
		<th align="center">{{round($project->experienced_total_average_output,2)}}</th>
	</tr>
	@foreach($project->positions as $position)
		@if($position->experienced_total_output && $position->experienced_total_hours_worked && $position->experienced_total_average_output)
			<tr>
				<td align="center">{{$position->name}}</td>
				<td align="center">{{round($position->experienced_total_output,2)}}</td>
				<td align="center">{{round($position->experienced_total_hours_worked,2)}}</td>
				<td align="center">{{round($position->experienced_total_average_output,2)}}</td>
				<td align="center">{{round($position->experienced_productivity_met,2)}}</td>
			</tr>
		@endif
	@endforeach
	<tr>
		<th align="center">Grand Total</th>
		<th align="center">{{round($project->total_output,2)}}</th>
		<th align="center">{{round($project->total_hours_worked,2)}}</th>
		<th align="center">{{round($project->total_average_output,2)}}</th>
	</tr>
</table>