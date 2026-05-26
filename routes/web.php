<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Guest\HomeController;

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\AdminManagementController;
use App\Http\Controllers\Admin\ElectedOfficialsController;
use App\Http\Controllers\Admin\FileManagerController;
use App\Http\Controllers\Admin\FileController;
use App\Http\Controllers\Admin\ViewFileController;
use App\Http\Controllers\Admin\ReportsController;
use App\Http\Controllers\Admin\BrgyOrdinancesController;

Route::get('/storage', function () {
    Artisan::call('storage:link');
});

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::middleware(['auth', 'admin'])->group(function () {
    
    Route::prefix('admin')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');

        Route::get('/admin-management', [AdminManagementController::class, 'index'])->name('admin.management');
        Route::post('/admin-management/create', [AdminManagementController::class, 'createAdmin'])->name('create.admin');
        Route::patch('/admin-management/update', [AdminManagementController::class, 'updateAdmin'])->name('update.admin');
        Route::delete('/admin-management/delete', [AdminManagementController::class, 'deleteAdmin'])->name('delete.admin');

        Route::get('/elected-officials', [ElectedOfficialsController::class, 'index'])->name('admin.elected-officials');
        Route::post('/elected-officials/create', [ElectedOfficialsController::class, 'createOfficial'])->name('create.official');
        Route::post('/elected-officials/update', [ElectedOfficialsController::class, 'updateOfficial'])->name('update.official');
        Route::delete('/elected-officials/delete', [ElectedOfficialsController::class, 'deleteOfficial'])->name('delete.official');
    
        Route::get('/municipal-ordinances', [FileManagerController::class, 'index'])->name('admin.file-manager');
        Route::post('/municipal-ordinances/create', [FileManagerController::class, 'createCategory'])->name('create.category');
        Route::patch('/municipal-ordinances/update', [FileManagerController::class, 'updateCategory'])->name('update.category');
        Route::delete('/municipal-ordinances/delete', [FileManagerController::class, 'deleteCategory'])->name('delete.category');

        Route::get('/files/{id}', [FileController::class, 'index'])->name('admin.files');
        Route::post('/files/create', [FileController::class, 'createFile'])->name('create.file');
        Route::post('/files/update', [FileController::class, 'updateFile'])->name('update.file');
        Route::delete('/files/delete', [FileController::class, 'deleteFile'])->name('delete.file');
        Route::post('/files/subcategory/create', [FileController::class, 'createSubcategory'])->name('create.subcategory');
        Route::patch('/files/subcategory/update', [FileController::class, 'updateSubcategory'])->name('update.subcategory');
        Route::delete('/files/subcategory/delete', [FileController::class, 'deleteSubcategory'])->name('delete.subcategory');

        Route::get('/view-file/{id}', [ViewFileController::class, 'index'])->name('admin.view-file');

        Route::get('/reports', [ReportsController::class, 'index'])->name('admin.reports');

        Route::get('/brgy-ordinances', [BrgyOrdinancesController::class, 'index'])->name('admin.brgy-ordinances');
        Route::post('/brgy-ordinances/create', [BrgyOrdinancesController::class, 'createBrgy'])->name('create.brgy');
        Route::patch('/brgy-ordinances/update', [BrgyOrdinancesController::class, 'updateBrgy'])->name('update.brgy');
        Route::delete('/brgy-ordinances/delete', [BrgyOrdinancesController::class, 'deleteBrgy'])->name('delete.brgy');
        
        Route::get('/brgy-ordinances/{id}', [BrgyOrdinancesController::class, 'viewBrgy'])->name('admin.view-brgy');
        Route::post('/brgy-ordinances/create-file', [BrgyOrdinancesController::class, 'createFile'])->name('create.brgy-file');
        Route::post('/brgy-ordinances/update-file', [BrgyOrdinancesController::class, 'updateFile'])->name('update.brgy-file');
        Route::delete('/brgy-ordinances/delete-file', [BrgyOrdinancesController::class, 'deleteFile'])->name('delete.brgy-file');

    });
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/user.php';
