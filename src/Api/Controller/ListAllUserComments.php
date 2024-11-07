<?php

namespace Justoverclock\ProfileComments\Api\Controller;

use Flarum\Api\Controller\AbstractListController;
use Flarum\Http\RequestUtil;
use Flarum\Http\UrlGenerator;
use Flarum\Query\QueryCriteria;
use Flarum\User\Exception\PermissionDeniedException;
use Flarum\User\Filter\UserFilterer;
use Flarum\User\Search\UserSearcher;
use Illuminate\Support\Arr;
use Justoverclock\ProfileComments\Api\Serializers\UserCommentSerializer;
use Justoverclock\ProfileComments\Model\UserCommentsModel;
use Psr\Http\Message\ServerRequestInterface as Request;
use Tobscure\JsonApi\Document;

class ListAllUserComments extends AbstractListController
{
    public $serializer = UserCommentSerializer::class;

    public $sortFields = [
        'createdAt'
    ];

    protected $filterer;
    protected $searcher;
    protected $url;
    public $limit = 30;
    public $maxLimit = 50;

    public function __construct(UserFilterer $filterer, UserSearcher $searcher, UrlGenerator $url)
    {
        $this->filterer = $filterer;
        $this->searcher = $searcher;
        $this->url = $url;
    }

    protected function data(Request $request, Document $document)
    {


        $actor = RequestUtil::getActor($request);

        if (!$actor->isAdmin()) {
            throw new PermissionDeniedException();
        }

        $actor->assertCan('searchUsers');


        $filters = $this->extractFilter($request);
        $sort = $this->extractSort($request);
        $sortIsDefault = $this->sortIsDefault($request);

        $limit = $this->extractLimit($request);
        $offset = $this->extractOffset($request);
        $include = $this->extractInclude($request);


        $totalComments = UserCommentsModel::all()->count();

        $query = UserCommentsModel::with('commentedBy')
            ->skip($offset)
            ->take($limit)
            ->get();

        $criteria = new QueryCriteria($actor, $filters, $sort, $sortIsDefault);
        if (array_key_exists('q', $filters)) {
            $results = $this->searcher->search($criteria, $limit, $offset);
        } else {
            $results = $this->filterer->filter($criteria, $limit, $offset);
        }

        $document->addPaginationLinks(
            $this->url->to('api')->route('user_comments.list'),
            $request->getQueryParams(),
            $offset,
            $limit,
            $results->areMoreResults() ? null : 0
        );

        $results = $results->getResults();
        $this->loadRelations($results, $include, $request);

        $document->setMeta(
            [
                'total' => $totalComments,
                'totalPages' => ceil($totalComments / $limit)
            ]
        );

        return $query;
    }
}
