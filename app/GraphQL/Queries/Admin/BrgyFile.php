<?php declare(strict_types=1);

namespace App\GraphQL\Queries\Admin;

use App\Models\Officials;
use App\Models\User;
use App\Models\Barangay;
use App\Models\BrgyFiles;
use Illuminate\Support\Facades\Auth;
use Illuminate\Auth\Access\AuthorizationException;
use App\Http\Controllers\AESCipher;

final readonly class BrgyFile
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        if (! $this->authorize()) {
            throw new AuthorizationException('You are not authorized to access fields');
        }

        $aes = new AESCipher();
      
        $page = $args['page'];
        $perPage = $args['first'];

        $search = $args['search'] ?? '';

        $paginator = BrgyFiles::with((new BrgyFiles)->relation)
            ->where('barangayID', $aes->decrypt($args['id']))
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
            $q->where('title', 'like', "%{$search}%")
                ->orWhere('dateReceived', 'like', "%{$search}%");
        });
    })
    ->orderBy('created_at', 'DESC')
    ->paginate($perPage, ['*'], 'page', $page);

        return [
            'brgyName' => Barangay::find($aes->decrypt($args['id'])),
            
            'filesListPaginated' => [
                'data' => $paginator->items(),
                'paginatorInfo' => [
                    'currentPage' => $paginator->currentPage(),
                    'lastPage' => $paginator->lastPage(),
                    'perPage' => $paginator->perPage(),
                    'total' => $paginator->total(),
                    'hasMorePages' => $paginator->hasMorePages(),
                ],
            ],
        ];
    }
    private function authorize(): bool
    {
        return Auth::user()->can('accessAdmin');
    }
}
