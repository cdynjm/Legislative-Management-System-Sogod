<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Http\Controllers\AESCipher;

class Files extends Model
{
    use Softdeletes;

    protected $table = 'files';

    public $relation = ['category', 'coAuthors', 'author'];

    protected $fillable = [
        'id',
        'categoryID',
        'municipalStatus',
        'provincialStatus',
        'authorID',
        'firstReadingDate',
        'publicHearingDate',
        'secondReadingDate',
        'thirdReadingDate',
        'ordinanceNumber',
        'finalOrdinanceNumber',
        'title',
        'finalTitle',
        'enactmentDate',
        'lceapprovalDate',
        'transmittalDate',
        'spslapprovalDate',
        'postStatus',
        'publishStatus',
        'implementationDate',
        'file'
    ];

    public function category()
    {
        return $this->hasOne(Categories::class, 'id', 'categoryID')->withTrashed();
    }

    public function author()
    {
        return $this->hasOne(Officials::class, 'id', 'authorID')->withTrashed();
    }

    public function coAuthors()
    {
        return $this->hasMany(CoAuthor::class, 'fileID', 'id');
    }

    public function getEncryptedIdAttribute(): string
    {
        return app(AESCipher::class)->encrypt((string) $this->attributes['id']);
    }
}
