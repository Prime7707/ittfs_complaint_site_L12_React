<?php

namespace Database\Seeders;

use App\Models\Complaint;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ComplaintSeeder extends Seeder
{
  /**
   * Run the database seeds.
   */
  public function run(): void
  {
    Complaint ::create([
			'category' => 'Maintenance',
			'title' => 'awda',
			'description' => 'aawdawdawdawdawd',
			'status' => "pending",
		]);
    Complaint ::create([
			'category' => 'Maintenance',
			'title' => 'awda',
			'description' => 'aawdawdawdawdawd',
			'status' => "pending",
		]);
    Complaint ::create([
			'category' => 'Maintenance',
			'title' => 'awda',
			'description' => 'aawdawdawdawdawd',
			'status' => "pending",
		]);
    Complaint ::create([
			'category' => 'Maintenance',
			'title' => 'awda',
			'description' => 'aawdawdawdawdawd',
			'status' => "pending",
		]);
  }
}
