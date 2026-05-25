<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Http\Controllers\AESCipher;

class BrgyFiles extends Model
{
    use SoftDeletes;

    public $relation = ['barangay'];

    protected $table = 'brgyfiles';

    protected $fillable = [
        'id',
        'barangayID',
        'dateReceived',
        'status'
    ];

    public function barangay()
    {
        return $this->belongsTo(Barangay::class, 'barangayID', 'id')->withTrashed();
    }

    public function getEncryptedIdAttribute(): string
    {
        return app(AESCipher::class)->encrypt((string) $this->attributes['id']);
    }
}
