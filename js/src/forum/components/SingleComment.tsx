// @ts-nocheck
import Component, { ComponentAttrs } from 'flarum/common/Component';
import Mithril from 'mithril';
import { SingleCommentProps } from '../types';
import app from 'flarum/forum/app';

export default class SingleComment extends Component<SingleCommentProps> {
  oninit(vnode: Mithril.Vnode<ComponentAttrs, this>) {
    super.oninit(vnode);
  }

  oncreate(vnode: Mithril.VnodeDOM<ComponentAttrs, this>) {
    super.oncreate(vnode);
  }

  async deleteComment(commentId: string) {
    await app.request({
      method: 'DELETE',
      url: `${app.forum.attribute('apiUrl')}/user-comment-delete/${commentId}`,
    });

    if (this.attrs.refreshComments) {
      this.attrs.refreshComments();
    }
  }

  view(vnode: Mithril.Vnode<ComponentAttrs, this>): Mithril.Children {
    const { commented_by: user } = this.attrs.commentedBy;
    const userInitials: string = this.attrs.commentedBy.commented_by.username.charAt(0).toUpperCase();

    return (
      <div className="profile-comment-container">
        <div>
          {this.attrs.relToUser.id.toString() === app.session.user.id() && (
            <button
              type="button"
              onclick={() => this.deleteComment(this.attrs.commentedBy.id)}
              class="delete-comment TagLabel colored text-contrast--light"
            >
              <span class="TagLabel-text">
                <span class="TagLabel-name">
                  <i class="fas fa-trash"></i>
                </span>
              </span>
            </button>
          )}
        </div>
        <div className="profile-comments-header">
          <div className="profile-comments">
            <img className="Avatar" loading="lazy" src={user.avatar_url || `https://placehold.co/25?text=${userInitials}`} alt="" />
          </div>
          <div className="profile-comment">
            <div>
              <span>
                <strong>{this.attrs.title}</strong>
              </span>
            </div>
            <p className="profile-user-comment">{this.attrs.comment}</p>
            <div className="profile-comments-info">
              <span className="profile-comment-username">
                <div className="profile-comment-info-container">
                  <span className="profile-comment-username">
                    <i class="fa fa-user" style={{ marginRight: '5px' }}></i> {user.username}
                  </span>
                </div>
              </span>
              <span className="profile-comment-username">
                <i class="fas fa-clock" style={{ marginRight: '5px' }}></i> {this.attrs.commentedBy.createdAt.slice(0, 10)}
              </span>
              <span className="profile-comment-username">
                <i class="fas fa-comments" style={{ marginRight: '5px' }}></i> {user.discussion_count.toString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
