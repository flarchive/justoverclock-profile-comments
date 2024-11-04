import app from 'flarum/forum/app';
import UserPage from 'flarum/forum/components/UserPage';
import { extend } from 'flarum/common/extend';
import Mithril from 'mithril';
import ItemList from 'flarum/common/utils/ItemList';
import User from 'flarum/common/models/User';
// @ts-ignore
import LinkButton from 'flarum/components/LinkButton';
import UserCommentsPage from './Pages/UserCommentsPage';

app.initializers.add('justoverclock/profile-comments', () => {
  app.routes['user.profileComments'] = {
    path: '/u/:username/profile-comments',
    component: UserCommentsPage,
  };

  extend(UserPage.prototype, 'navItems', function (items: ItemList<Mithril.Children>) {
    const user: User | null = this.user;

    if (user) {
      items.add(
        'profileCommentLink',
        <LinkButton href={app.route('user.profileComments', { username: user?.slug() })} name="profile-comments" icon="fas fa-comment">
          {app.translator.trans('justoverclock-profile-comments.forum.commentsPageLink')}
        </LinkButton>
      );
    }
  });
});
