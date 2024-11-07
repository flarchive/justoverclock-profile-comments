<?php

namespace Justoverclock\ProfileComments\Model;

use Flarum\Database\AbstractModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Flarum\User\User;

/**
 * @property int $id
 * @property int $user_id
 * @property int $commented_by
 * @property string $comment_title
 * @property string $comment
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class UserCommentsModel extends AbstractModel
{
    protected $table = 'user_comments';
    public $timestamps = true;

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function commentedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'commented_by');
    }
}

