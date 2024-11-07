<?php

namespace Justoverclock\ProfileComments\Notification;

use Flarum\Notification\NotificationSyncer;
use Illuminate\Contracts\Events\Dispatcher;
use Justoverclock\ProfileComments\Events\ProfileCommentCreated;

class SendNotificationWhenCommentIsCreated
{
    protected $notifications;

    public function __construct(NotificationSyncer $notifications)
    {
        $this->notifications = $notifications;
    }

    public function subscribe(Dispatcher $events)
    {
        $events->listen(ProfileCommentCreated::class, [$this, 'handle']);
    }

    public function handle(ProfileCommentCreated $event)
    {
        $userComment = $event->userComment;

        $this->notifications->sync(
            new NewCommentNotificationBlueprint($userComment),
            [$userComment->user]
        );

    }
}
