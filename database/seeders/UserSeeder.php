<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
	/**
	 * Run the database seeds.
	 */
	public function run(): void
	{
		User::create([
			'name' => 'Admin',
			'email' => 'admin@sample.com',
			'password' => Hash::make('11111111'),
			'role' => 'admin',
			'status' => 1,
		]);

		User::create([
			'name' => 'User',
			'email' => 'user@sample.com',
			'password' => Hash::make('11111111'),
			'role' => 'user',
			'status' => 1,
		]);
	}
}
