@extends('main')

@section('content')
	<md-card flex>
		<md-card-content>
			<form method="POST" action="/auth/register" class="wide-form">
				{!! csrf_field() !!}
				<div layout="row">
					<!-- First Name -->
					<md-input-container flex>
						<label>First Name</label>
						<input type="text" name="first_name" value="{{ old('first_name') }}">
					</md-input-container>
					<!-- Last Name -->
					<md-input-container flex>
						<label>Last Name</label>
						<input type="text" name="last_name" value="{{ old('last_name') }}">
					</md-input-container>
				</div>
				<!-- Department -->
				<md-subheader class="md-no-sticky">Department</md-subheader>
				<div layout="row" flex>
					<md-input-container flex>
						<select name="department" ng-model="department">
							<option ng-repeat="department in departments" value="<% department.name %>">
								<% department.name %>
							</option>
						</select>
					</md-input-container>
				</div>
				<!-- Email -->
				<md-input-container flex>
					<label>Email</label>
					<input type="email" name="email" value="{{ old('email') }}">
				</md-input-container>
				<div layout="row">
					<!-- Password -->
					<md-input-container flex>
						<label>Password</label>
						<input type="password" name="password">
					</md-input-container>
					<!-- Confirm Password -->
					<md-input-container flex>
						<label>Confirm Password</label>
						<input type="password" name="password_confirmation">
					</md-input-container>
				</div>
				<div layout="row" layout-align="end center">
					<md-button type="submit" class="md-primary md-raised">Register</md-button>
				</div>
			</form>
		</md-card-content>
	</md-card>
@stop