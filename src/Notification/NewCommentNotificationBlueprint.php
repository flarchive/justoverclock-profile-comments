<?php

namespace Justoverclock\ProfileComments\Notification;

use Flarum\Notification\Blueprint\BlueprintInterface;
use Flarum\User\User;
use Justoverclock\ProfileComments\Model\UserCommentsModel;

class NewCommentNotificationBlueprint implements BlueprintInterface
{
    public UserCommentsModel $userComment;

    public function __construct(UserCommentsModel $userComment)
    {
        $this->userComment = $userComment;
    }

    public function getFromUser(): User
    {
        return $this->userComment->commentedByUser;
    }

    public function getSubject(): User
    {
        return $this->userComment->user;
    }

    public function getData(): array
    {
        return [
            'comment_title' => $this->userComment->comment_title,
            'comment' => $this->userComment->comment,
            'created_at' => $this->userComment->created_at->toDateTimeString(),
        ];
    }

    public static function getType(): string
    {
        return 'profileComment';
    }

    public static function getSubjectModel(): string
    {
        return User::class;
    }
}
