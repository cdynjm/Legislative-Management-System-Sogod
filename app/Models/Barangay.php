<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Http\Controllers\AESCipher;

class Barangay extends Model
{
    use SoftDeletes;

    public $relation = ['brgyfiles'];

    protected $table = 'barangays';

    protected $fillable = [
        'id',
        'brgyname',
    ];

    public function brgyfiles()
    {
        return $this->hasMany(BrgyFiles::class)->withTrashed();
    }

    public function getEncryptedIdAttribute(): string
    {
        return app(AESCipher::class)->encrypt((string) $this->attributes['id']);
    }
}
