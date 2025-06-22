<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FrontendController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::	group([], function () {
	Route::get('/', [FrontendController::class, 'homeView'])->name('home');
	Route::post('/api/complaints/submit', [FrontendController::class, 'complaintStore'])->name('complaint.store');
	Route::get('/api/complaints', [FrontendController::class, 'complaintsView'])->name('complaints');
});

Route::middleware('auth')->prefix('api/dashboard')->group(function () {
	Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
	Route::get('/personal-info', [DashboardController::class, 'personalInfo'])->name('dashboard.personal-info');
	Route::put('/update-personal-info', [DashboardController::class, 'updateInfo'])->name('dashboard.update.personalInfo');
	Route::put('/update-passwrod', [DashboardController::class, 'passwordUpdate'])->name('dashboard.update.password');
});

// Route::get('/', function () {
// 	return Inertia::render('welcome');
// })->name('home');

// Route::middleware(['auth', 'verified'])->group(function () {
// 	Route::get('dashboard', function () {
// 		return Inertia::render('dashboard');
// 	})->name('dashboard');
// });


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/admin.php';
require __DIR__ . '/api.php';
