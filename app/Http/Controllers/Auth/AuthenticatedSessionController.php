<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
	/**
	 * Show the login page.
	 */
	public function login(Request $request): Response
	{
		return Inertia::render('auth/login', [
			'canResetPassword' => Route::has('password.request'),
			'status' => $request->session()->get('status'),
		]);
	}

	protected function validator(array $data)
	{
		return Validator::make($data, [
			'email' => ['required', 'string'],
			'password' => ['required', 'string'],
		]);
	}
	protected function credentials(array $data)
	{
		// $username = filter_var($data['username'], FILTER_VALIDATE_EMAIL) ? 'email' : 'username';
		return [
			'email' => $data['email'],
			'password' => $data['password']
		];
	}
	/**
	 * Handle an incoming authentication request.
	 */
	public function loginAttempt(Request $request): RedirectResponse
	{
		$validator = $this->validator($request->all());
		if ($validator->fails()) {
			$errMessages = [];
			foreach ($validator->errors()->messages() as $key => $msg) {
				$errMessages[] = $msg[0];
			}
			// $errorsOut = "<ul style=\"list-style:none;padding:0;margin:0\">";
			// foreach ($errMessages as $errMsg) {
			// 	$errorsOut .= "<li>" . $errMsg . "</li>";
			// }
			// $errorsOut .= "</ul>";
			$notification = [
				// 'title' => 'Error',
				'message' => $errMessages,
				'alert_type' => 'error',
			];
			return redirect(route('home'))->withErrors($validator)->with('notification', $notification);
		}

		$credentials = $this->credentials($request->all());
		$user = User::where(array_keys($credentials)[0], array_values($credentials)[0])->first();
		if ($user) {
			if ($user->status == 0) {
				$notification = [
					// 'title' => 'Status',
					'message' => "User is Disabled",
					'alert_type' => 'error'
				];
				return redirect(route('home'))->with('notification', $notification);
			}
			if (Auth::guard('web')->attempt($credentials, (bool) $request['remember'])) {
				// if ($user->status == 1) {
				// $request->authenticate();
				$request->session()->regenerate();
				$notification = [
					// 'title' => 'Status',
					'message' => "Logged in Successfully",
					'alert_type' => 'success'
				];
				return redirect()->intended(route('home'))->with('notification', $notification);
			}
		}
		$notification = [
			// 'title' => 'Stat	us',
			'message' => "Incorrect Username or Password",
			'alert_type' => 'error'
		];
		return redirect(route('home'))->with('notification', $notification);
	}

	/**
	 * Destroy an authenticated session.
	 */
	public function logoutAttempt(Request $request): RedirectResponse
	{
		Auth::guard('web')->logout();
		$request->session()->invalidate();
		$request->session()->regenerateToken();
		$notification = [
			// 'title' => 'Status',
			'message' => "Logged Out Successfully",
			'alert_type' => 'success'
		];
		return redirect(route('home'))->with('notification', $notification);
	}
	public function apiLogoutAttempt(Request $request): RedirectResponse
	{
		Auth::guard('web')->logout();
		$request->session()->invalidate();
		$request->session()->regenerateToken();
		$notification = [
			// 'title' => 'Status',
			'message' => "Logged Out Successfully",
			'alert_type' => 'success'
		];
		return redirect(route('home'))->with('notification', $notification);
	}
}
