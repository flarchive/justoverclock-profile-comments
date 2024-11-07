// @ts-nocheck
import Notification, {INotificationAttrs} from "flarum/forum/components/Notification";
import app from 'flarum/forum/app';
import Mithril from "mithril";

export default class NewProfileCommentNotification extends Notification {
  oncreate(vnode: Mithril.VnodeDOM<INotificationAttrs, this>) {
    super.oncreate(vnode);
  }

  icon(): string {
    return "fas fa-comments";
  }

  href(): string {
    if (app.session.user) {
      return `${app.route.user(app?.session?.user)}/profile-comments`;
    } else {
      return '#'
    }
  }

  content(): Mithril.Children {
      return app.translator.trans('justoverclock-profile-comments.forum.newCommentText');
  }

  excerpt(): Mithril.Children {
    return undefined;
  }
}
