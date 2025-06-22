<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Support\Facades\Route;

// Route::middleware('auth', 'verified', 'role_check:admin')->prefix('admin/dashboard')->name('admin.')->group(function () {
// 	Route::get('/', [AdminDashboardController::class, 'dashboardIndex'])->name('dashboard');
// });

// Route::middleware('auth')->group(function () {
// 	Route::post('api/logout', [AuthenticatedSessionController::class, 'apiLogoutAttempt'])->name('apiLogout');
// });