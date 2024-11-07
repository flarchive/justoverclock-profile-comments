<?php

namespace Justoverclock\ProfileComments\Api\Controller;

use Flarum\Api\Controller\AbstractCreateController;
use Flarum\Notification\NotificationSyncer;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Arr;
use Justoverclock\ProfileComments\Api\Serializers\UserCommentSerializer;
use Justoverclock\ProfileComments\Events\ProfileCommentCreated;
use Justoverclock\ProfileComments\Model\UserCommentsModel;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class CreateUserComment extends AbstractCreateController
{
    public $serializer = UserCommentSerializer::class;
    protected $dispatcher;
    protected NotificationSyncer $notificationSyncer;

    public function __construct(NotificationSyncer $notificationSyncer, Dispatcher $dispatcher)
    {
        $this->notificationSyncer = $notificationSyncer;
        $this->dispatcher = $dispatcher;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = $request->getAttribute('actor');
        $data = $request->getParsedBody();

        $userId = Arr::get($data, 'data.relationships.user.data.id');
        $commentedById = $actor->id;
        $commentTitle = Arr::get($data, 'data.attributes.comment_title');
        $comment = Arr::get($data, 'data.attributes.comment');

        $userComment = new UserCommentsModel();
        $userComment->user_id = $userId;
        $userComment->commented_by = $commentedById;
        $userComment->comment_title = $commentTitle;
        $userComment->comment = $comment;
        $userComment->save();

        $userComment->load('commentedByUser', 'user');

        $this->dispatcher->dispatch(new ProfileCommentCreated($userComment, $actor));

        return $userComment;
    }
}
