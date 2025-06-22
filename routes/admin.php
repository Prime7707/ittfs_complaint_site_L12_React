<?php

use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth', 'role_check:admin')->prefix('api/admin')->group(function () {
	Route::get('/user-management', [DashboardController::class, 'userManagement'])->name('dashboard.user-management');
	Route::post('/user-management/add-user', [DashboardController::class, 'userAdd'])->name('dashboard.user-management.addUser');
	Route::get('/user_management/get-users', [DashboardController::class, 'getUsers'])->name('dashboard.user_management.getUsers');
	Route::put('/user-management/edit-user/{user}', [DashboardController::class, 'userEdit'])->name('dashboard.user-management.editUser');
	Route::delete('/user-management/delete-user/{id}', [DashboardController::class, 'userDelete'])->name('dashboard.user-management.deleteUser');
	
	Route::get('/complaint-management', [DashboardController::class, 'complaintManagement'])->name('dashboard.complaint-management');
	Route::get('/user_management/get-complaints', [DashboardController::class, 'getComplaints'])->name('dashboard.user_management.getComplaints');
	Route::post('/user_management/respond-complaints/{id}', [DashboardController::class, 'respondComplaint'])->name('dashboard.user_management.respondComplaint');
	Route::delete('/user_management/delete-complaints/{id}', [DashboardController::class, 'deleteComplaint'])->name('dashboard.user_management.deleteComplaint');

});
