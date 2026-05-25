<?php declare(strict_types=1);

namespace App\GraphQL\Queries\Admin;

use App\Models\Officials;
use App\Models\User;
use App\Models\Categories;
use App\Models\Files;
use Illuminate\Support\Facades\Auth;
use Illuminate\Auth\Access\AuthorizationException;
use App\Http\Controllers\AESCipher;

final readonly class File
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

        $paginator = Files::with((new Files)->relation)
            ->where('categoryID', $aes->decrypt($args['id']))
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {

            // Main file fields
            $q->where('title', 'like', "%{$search}%")
                ->orWhere('finalTitle', 'like', "%{$search}%")
                ->orWhere('ordinanceNumber', 'like', "%{$search}%")
                ->orWhere('finalOrdinanceNumber', 'like', "%{$search}%")

                ->orWhere('municipalStatus', 'like', "%{$search}%")
                ->orWhere('provincialStatus', 'like', "%{$search}%")

                ->orWhere('firstReadingDate', 'like', "%{$search}%")
                ->orWhere('publicHearingDate', 'like', "%{$search}%")
                ->orWhere('secondReadingDate', 'like', "%{$search}%")
                ->orWhere('thirdReadingDate', 'like', "%{$search}%")

                ->orWhere('enactmentDate', 'like', "%{$search}%")
                ->orWhere('lceapprovalDate', 'like', "%{$search}%")
                ->orWhere('transmittalDate', 'like', "%{$search}%")
                ->orWhere('spslapprovalDate', 'like', "%{$search}%")

                ->orWhere('implementationDate', 'like', "%{$search}%");

            // Category
            $q->orWhereHas('category', function ($cat) use ($search) {
                $cat->where('category', 'like', "%{$search}%");
            });

            // Author
            $q->orWhereHas('author', function ($author) use ($search) {
                $author->where('name', 'like', "%{$search}%")
                    ->orWhere('position', 'like', "%{$search}%");
            });

            // Co-authors
            $q->orWhereHas('coAuthors.official', function ($co) use ($search) {
                $co->where('name', 'like', "%{$search}%")
                    ->orWhere('position', 'like', "%{$search}%");
            });
        });
    })
    ->orderBy('created_at', 'DESC')
    ->paginate($perPage, ['*'], 'page', $page);

        return [
            'categoryName' => Categories::find($aes->decrypt($args['id'])),
            
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

            'authors' => Officials::orderBy('name', 'ASC')->get(),

            'subCategoriesList' => Categories::where('parentID', $aes->decrypt($args['id']))
            ->where('category', 'like', '%'.$args['search'].'%')
            ->orderBy('created_at', 'DESC')->get(),
        ];
    }
    private function authorize(): bool
    {
        return Auth::user()->can('accessAdmin');
    }
}
