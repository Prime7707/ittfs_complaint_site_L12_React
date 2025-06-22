<?php

namespace App\Http\Controllers;

use App\Models\Complaint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\ImageManager;
// use Intervention\Image\Drivers\Imagick\Driver;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Str;
use Inertia\Inertia;

class FrontendController extends Controller
{
	public function homeView()
	{
		$title = "Home";
		return Inertia::render('client/home', ['title' => $title]);
	}

	protected function validator(array $data)
	{
		return Validator::make($data, [
			'category' => ['required', 'string'],
			'title' => ['required', 'string'],
			'description' => ['required', 'string'],
		]);
	}
	public function complaintStore(Request $request)
	{
		// dd($request);
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
			return redirect()->back()->withErrors($validator)->with('notification', $notification);
		}

		$complaint = new Complaint();
		$complaint->category = $request->category;
		$complaint->title = $request->title;
		$complaint->description = $request->description;
		if (Auth::check() && $request->anonymous !== '0') {
			$complaint->user_id = Auth::id();
		} else {
			$complaint->user_id = null;
		}

		if ($request->hasFile('image')) {
			$manager = new ImageManager(new Driver());
			$imgFile = $request->file('image');
			$image = $manager->read($imgFile);
			// Image Name
			$imageName = Str::slug(now()) . '-' . Str::slug($complaint->category) . '.' . $imgFile->getClientOriginalExtension();
			// Image path
			$relativePath = 'assets/images/complaints';
			$fullPath = public_path($relativePath);
			// Image path Exists?
			if (!file_exists($fullPath)) {
				mkdir($fullPath, 0755, true);
			}
			$image->resize(500, 500)->save($fullPath . '/' . $imageName);
			$complaint->image = $imageName;
		}
		$complaint->save();

		$notification = [
			// 'title' => 'Error',
			'message' => 'Complaint Submitted Successfully',
			'alert_type' => 'success',
		];
		return redirect()->back()->with('notification', $notification);
	}

	public function complaintsView()
	{
		$complaints = Complaint::leftJoin('admin_responses', 'complaints.id', '=', 'admin_responses.complaint_id')
			->orderBy('complaints.created_at', 'desc')
			->get([
				'complaints.id',
				'complaints.user_id',
				'complaints.title',
				'complaints.category',
				'complaints.description',
				'complaints.image',
				DB::raw('complaints.created_at as submit_date'),
				DB::raw('complaints.updated_at as resolved_date'),
				'complaints.status',
				'admin_responses.response as admin_response' // ✅ Attach admin response
			]);
		$title = "Complaints";
		return Inertia::render('client/complaints', ['title' => $title, 'complaints' => $complaints]);
	}
}
