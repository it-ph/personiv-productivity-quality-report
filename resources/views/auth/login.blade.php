@extends('main')

@section('content')
	<md-card>
		<md-card-content>
			<form method="POST" action="/auth/login" class="form">
				{!! csrf_field() !!}
				<!-- Email -->
				<md-input-container>
					<label>Email</label>
					<input type="email" name="email" value="{{ old('email') }}">
				</md-input-container>
				<!-- Password -->
				<md-input-container>
					<label>Password</label>
					<input type="password" name="password">
				</md-input-container>
				<div class="md-actions" layout="row" layout-align="space-between center">
					<!-- Remember Me -->
					<md-checkbox aria-label="remember me" name="remember" class="md-primary">Keep me logged in</md-checkbox>
					<!-- Submit Button -->
					<md-button type="submit" class="md-primary md-raised">Login</md-button>
				</div>
			</form>
		</md-card-content>
	</md-card>
@stop