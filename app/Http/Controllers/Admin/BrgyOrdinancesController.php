<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Barangay;
use App\Models\BrgyFiles;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rule;
use App\Http\Controllers\AESCipher;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\File;

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

    public function viewBrgy(Request $request) {
        return Inertia::render('Admin/View-Brgy', [
            'id' => $request->id,
        ]);
    }

    public function createFile(Request $request)
    {
        $timestamp = Carbon::now()->format('YmdHis'); 
        $title = \Str::slug(\Str::limit($request->title, 70));
        $extension = $request->file('file')->getClientOriginalExtension();
        $filename = "{$title}...-{$timestamp}.{$extension}";
        $transferfile = $request->file('file')->storeAs('brgy-files', $filename, 'public');

        $file = BrgyFiles::create([
            'barangayID' => $this->aes->decrypt($request->barangayID),
            'title' => $request->title,
            'dateReceived' => $request->dateReceived,
            'status' => $request->status,
            'file' => $filename,
            'appropriation' => $request->appropriation ?? null,
        ]);
    }

    public function updateFile(Request $request) 
    {
        $file = BrgyFiles::where('id', $this->aes->decrypt($request->id))->update([
            'barangayID' => $this->aes->decrypt($request->barangayID),
            'title' => $request->title,
            'dateReceived' => $request->dateReceived,
            'status' => $request->status,
            'appropriation' => $request->appropriation
        ]);

        if ($request->file != null) {

            $files = BrgyFiles::where('id', $this->aes->decrypt($request->id))->first();

            if($files->file != null) {
                File::delete(public_path('storage/brgy-files/'.$files->file));
            }

            $timestamp = Carbon::now()->format('YmdHis');
            $title = \Str::slug(\Str::limit($request->title, 70));
            $extension = $request->file('file')->getClientOriginalExtension();
            $filename = "{$title}...-{$timestamp}.{$extension}";
            $transferfile = $request->file('file')->storeAs('brgy-files', $filename, 'public');

            BrgyFiles::where('id', $this->aes->decrypt($request->id))->update([
                'file' => $filename,
            ]);
        }
    }

    public function deleteFile(Request $request) 
    {
        $files = BrgyFiles::where('id', $this->aes->decrypt($request->id))->first();

        if($files->file != null) {
            File::delete(public_path('storage/brgy-files/'.$files->file));
        }

        BrgyFiles::where('id', $this->aes->decrypt($request->id))->delete();
    }
}
