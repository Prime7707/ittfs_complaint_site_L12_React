<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Complaint;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class DashboardController extends Controller
{
	public function index()
	{
		$title = "Dashboard";
		return Inertia::render('dashboard/dashboard', ['title' => $title]);
	}

	public function personalInfo()
	{
		$title = "Personal Info";
		return Inertia::render('dashboard/personal-info', ['title' => $title]);
	}

	public function updateInfo(Request $request)
	{
		$validator = Validator::make($request->all(), [
			'name' => ['required', 'string', 'max:255'],
		]);
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
			return redirect()->back()->withErrors($validator)->with('notification', $notification);
		}
		$request->user()->update([
			'name' => $request->name,
		]);
		$notification = [
			// 'title' => 'Error',
			'message' => "Personal Info Updated",
			'alert_type' => 'success',
		];
		return redirect()->back()->with('notification', $notification);
	}

	public function passwordUpdate(Request $request): RedirectResponse
	{
		$user = Auth::user();
		$validator = Validator::make($request->all(), [
			'current_password' => ['required', 'string'],
			'password' => ['required', 'string', 'min:8', 'confirmed'],
		]);
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
			return redirect()->back()->withErrors($validator)->with('notification', $notification);
		}
		if (!Hash::check($request->current_password, $user->password)) {
			$notification = [
				// 'title' => 'Error',
				'message' => "Current Password is Incorrect",
				'alert_type' => 'error',
			];
			return redirect()->back()->withErrors(['current_password' => 'Current password is incorrect'])->with('notification', $notification);
		}

		$request->user()->update([
			'password' => Hash::make($request['password']),
		]);

		$notification = [
			// 'title' => 'Error',
			'message' => "Password Updated Successfully",
			'alert_type' => 'success',
		];
		return redirect()->back()->with('notification', $notification);
	}

	public function userManagement()
	{
		$title = "User Management";
		return Inertia::render('dashboard/user-management', ['title' => $title]);
	}

	protected function addValidator(array $data)
	{
		return Validator::make($data, [
			'name' => ['required', 'string', 'max:100', 'unique:users,name'],
			'email' => ['required', 'string', 'email', 'max:100', 'unique:users,email'],
			'password' => ['required', 'confirmed', Rules\Password::defaults()],
		]);
	}
	public function userAdd(Request $request): RedirectResponse
	{
		$validator = $this->addValidator($request->all());
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
				'title' => 'Error',
				'message' => $errMessages,
				'alert_type' => 'error',
			];
			return redirect()->back()->withErrors($validator)->with('notification', $notification);
		}

		$user = User::create([
			'name' => $request->name,
			'email' => $request->email,
			'password' => Hash::make($request->password),
			'role' => Str::lower($request->role),
			'status' => $request->status,
		]);

		event(new Registered($user));

		$notification = [
			// 'title' => 'Status',
			'message' => 'User Added Successfully',
			'alert_type' => 'success',
		];
		return redirect()->back()->with('notification', $notification);
	}

	public function getUsers(Request $request)
	{
		$users = User::where('id', '!=', Auth::id())->select('id', 'name', 'email', 'role', 'status')->orderBy('name')->get();
		return response()->json($users);
	}

	protected function editValidator(array $data, $userId)
	{
		return Validator::make($data, [
			'name' => ['required', 'string', 'max:100', Rule::unique('users', 'name')->ignore($userId)],
			'email' => ['required', 'string', 'email', 'max:100', Rule::unique('users', 'email')->ignore($userId)],
			'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
			'role' => ['nullable', 'string'],
			'status' => ['nullable', 'string'],
		]);
	}

	public function userEdit(Request $request, User $user)
	{
		$validator = $this->editValidator($request->all(), $user->id);
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
				'title' => 'Error',
				'message' => $errMessages,
				'alert_type' => 'error',
			];
			return redirect()->back()->withErrors($validator)->with('notification', $notification);
		}
		$userData = $validator->validated();
		// Only update password if provided
		if ($request->filled('password')) {
			$userData['password'] = Hash::make($request->password);
		} else {
			unset($userData['password']);
		}
		$userData['role'] = Str::lower($request->role);

		$user->update($userData);

		$notification = [
			// 'title' => 'Status',
			'message' => 'User Updated Successfully',
			'alert_type' => 'success',
		];
		return redirect()->back()->with('notification', $notification);
	}

	public function userDelete($id)
	{
		$user = User::findOrFail($id);
		if ($user) {
			$complaintName = $user->name;
			$user->delete();
			$notification = [
				// 'title' => 'Error',
				'message' => "User " . $complaintName . " Deleted Successfully",
				'alert_type' => 'success',
			];
			return redirect()->back()->with('notification', $notification);
		}
		$notification = [
			// 'title' => 'Error',
			'message' => "User Doesnt Exist",
			'alert_type' => 'error',
		];
		return redirect()->back()->with('notification', $notification);
	}

	public function complaintManagement()
	{
		$title = "Complaint Management";
		return Inertia::render('dashboard/complaint-management', ['title' => $title]);
	}
	public function getComplaints(Request $request)
	{
		$complaints = DB::table('complaints')
			->leftJoin('admin_responses', 'complaints.id', '=', 'admin_responses.complaint_id')
			->leftJoin('users', 'complaints.user_id', '=', 'users.id') // ✅ Add this line
			->select(
				'complaints.id',
				'complaints.user_id',
				'complaints.title',
				'complaints.category',
				'complaints.description',
				'complaints.image',
				DB::raw('complaints.created_at as submit_date'),
				DB::raw('complaints.updated_at as resolved_date'),
				'complaints.status',
				'admin_responses.response as admin_response',
				DB::raw("COALESCE(users.email, 'Anonymous') as sender") // ✅ New: Sender column
			)
			->orderBy('complaints.created_at', 'desc')
			->get();

		return response()->json($complaints);
	}

	protected function responseValidator(array $data)
	{
		return Validator::make($data, [
			'response' => ['required', 'string'],
		]);
	}

	public function respondComplaint(Request $request, $id)
	{
		$validator = $this->responseValidator($request->all());
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
				'title' => 'Error',
				'message' => $errMessages,
				'alert_type' => 'error',
			];
			return redirect()->back()->withErrors($validator)->with('notification', $notification);
		}
		DB::table('admin_responses')->updateOrInsert(
			['complaint_id' => $id], // Match on complaint_id
			[
				'response' => $request->response,
				'updated_at' => now(),
				'created_at' => now(),
			]
		);
		DB::table('complaints')->where('id', $id)->update([
			'status' => 'resolved',
			'updated_at' => now(),
		]);
		$notification = [
			// 'title' => 'Status',
			'message' => 'Response Saved Successfully',
			'alert_type' => 'success',
		];
		return redirect()->back()->with('notification', $notification);
	}

	public function deleteComplaint($id)
	{
		$complaint = Complaint::findOrFail($id);
		if ($complaint) {
			$complaintTitle = $complaint->title;
			$imagePath = public_path('assets/images/complaints/' . $complaint->image);
			if (File::exists($imagePath)) {
				File::delete($imagePath);
			}
			$complaint->delete();
			$notification = [
				// 'title' => 'Error',
				'message' => "complaint " . $complaintTitle . " Deleted Successfully",
				'alert_type' => 'success',
			];
			return redirect()->back()->with('notification', $notification);
		}
		$notification = [
			// 'title' => 'Error',
			'message' => "complaint Doesnt Exist",
			'alert_type' => 'error',
		];
		return redirect()->back()->with('notification', $notification);
	}
}
