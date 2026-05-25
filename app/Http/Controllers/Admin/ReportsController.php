<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rule;
use App\Http\Controllers\AESCipher;

class ReportsController extends Controller
{
    public function __construct(protected AESCipher $aes) {}

    public function index()
    {
        return Inertia::render('Admin/Report');
    }
}
