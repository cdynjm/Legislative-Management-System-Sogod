<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Barangay;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rule;
use App\Http\Controllers\AESCipher;

class BrgyOrdinancesController extends Controller
{
    public function __construct(protected AESCipher $aes) {}

    public function index()
    {
        return Inertia::render('Admin/BrgyOrdinances');
    }

    public function createBrgy(Request $request) {
        $request->validate([
            'brgyname' => ['required','string','max:255'],
        ]);

        Barangay::create([
            'brgyname' => $request->brgyname,
        ]);
    }

    public function updateBrgy(Request $request) {
        $request->validate([
            'brgyname' => ['required','string','max:255'],
        ]);

        Barangay::where('id', $this->aes->decrypt($request->id))->update([
            'brgyname' => $request->brgyname,
        ]);
    }

    public function deleteBrgy(Request $request) {
        Barangay::where('id', $this->aes->decrypt($request->id))->delete();
    }
}
