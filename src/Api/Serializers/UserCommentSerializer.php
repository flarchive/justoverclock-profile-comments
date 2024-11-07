<?php

namespace Justoverclock\ProfileComments\Api\Serializers;


use Flarum\Api\Serializer\AbstractSerializer;

class UserCommentSerializer extends AbstractSerializer
{
    protected $type = 'user_comments';

    protected function getDefaultAttributes($model): array
    {
        return [
            'id' => $model->id,
            'related_to_user' => $model->user,
            'comment_title' => $model->comment_title,
            'comment' => $model->comment,
            'commented_by' => $this->commentedBy($model->commentedBy),
            'createdAt' => $this->formatDate($model->created_at),
            'updatedAt' => $this->formatDate($model->updated_at)
        ];
    }

    protected function commentedBy($user)
    {
        return $user ? [
            'id' => $user->id,
            'username' => $user->username,
            'email' => $user->email,
            'avatar_url' => $user->avatar_url,
            'discussion_count' => $user->discussion_count,
        ] : null;
    }
}
