<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Complaint extends Model
{
	protected $fillable = [
		'category',
		'title',
		'description',
		'image',
		'status',
	];
}
