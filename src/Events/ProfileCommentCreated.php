<?php

namespace Justoverclock\ProfileComments\Events;


use Flarum\User\User;
use Illuminate\Queue\SerializesModels;
use Justoverclock\ProfileComments\Model\UserCommentsModel;

class ProfileCommentCreated
{
    use SerializesModels;

    public $userComment;
    public $user;

    public function __construct(UserCommentsModel $userComment, User $user)
    {
        $this->userComment = $userComment;
        $this->user = $user;
    }
}
