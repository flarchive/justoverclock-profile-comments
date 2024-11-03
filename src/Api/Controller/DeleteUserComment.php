<?php

namespace Justoverclock\ProfileComments\Api\Controller;

use Flarum\Api\Controller\AbstractDeleteController;
use Flarum\Http\RequestUtil;
use Justoverclock\ProfileComments\Model\UserCommentsModel;
use Laminas\Diactoros\Response\EmptyResponse;
use Psr\Http\Message\ServerRequestInterface;

class DeleteUserComment extends AbstractDeleteController
{
    protected function delete(ServerRequestInterface $request)
    {
        $actor = RequestUtil::getActor($request);
        $commentId = $request->getQueryParams('commentId');


        $userComment = UserCommentsModel::query()
            ->where('id', $commentId)
            ->first();

        if (!$userComment) {
            return new EmptyResponse(404);
        }

        $userComment->delete();

        return ['deleted' => 'success'];
    }
}
