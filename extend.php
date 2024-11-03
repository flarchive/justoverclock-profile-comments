<?php

/*
 * This file is part of justoverclock/profile-comments.
 *
 * Copyright (c) 2024 Marco Colia.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace Justoverclock\ProfileComments;

use Flarum\Api\Serializer\UserSerializer;
use Flarum\Extend;
use Flarum\User\User;
use Justoverclock\ProfileComments\Api\Controller\CreateUserComment;
use Justoverclock\ProfileComments\Api\Controller\DeleteUserComment;
use Justoverclock\ProfileComments\Api\Controller\ListUserCommentsController;
use Justoverclock\ProfileComments\Api\Serializers\UserCommentSerializer;
use Justoverclock\ProfileComments\Model\UserCommentsModel;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js')
        ->css(__DIR__ . '/less/forum.less'),
    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js')
        ->css(__DIR__ . '/less/admin.less'),
    new Extend\Locales(__DIR__ . '/locale'),

    (new Extend\ApiSerializer(UserCommentsModel::class))
        ->attributes(UserCommentSerializer::class)
        ->relationship('user', UserSerializer::class, 'user_id')
        ->relationship('user', UserSerializer::class, 'user_id')
        ->relationship('commentedBy', UserSerializer::class, 'commented_by'),

    (new Extend\Model(UserCommentsModel::class))
        ->belongsTo('user', User::class, 'user_id')
        ->belongsTo('commentedBy', User::class, 'commented_by'),

    (new Extend\Routes('api'))
        ->get('/user_comments', 'user_comments.list', ListUserCommentsController::class)
        ->post('/user_comments', 'profile-comments.create', CreateUserComment::class)
        ->delete('/user-comment-delete/{commentId}', 'profile-comment.delete', DeleteUserComment::class),
];
