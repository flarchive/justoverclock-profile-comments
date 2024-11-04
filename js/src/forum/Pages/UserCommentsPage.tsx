// @ts-nocheck
import UserPage, { IUserPageAttrs } from 'flarum/forum/components/UserPage';
import Mithril from 'mithril';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import app from 'flarum/forum/app';
import listItems from 'flarum/common/helpers/listItems';
import { ApiResponsePlural } from 'flarum/common/Store';
import UserComment from '../Models/UserComment';
import SingleComment from '../components/SingleComment';
import AddCommentModal from '../components/AddCommentModal';
import { getTranslation } from '../utils/getTranslation';
import LeaveCommentArea from '../components/LeaveCommentArea';

export default class UserCommentsPage extends UserPage {
  oninit(vnode: Mithril.Vnode<IUserPageAttrs, this>) {
    super.oninit(vnode);
    this.loading = false;
    // @ts-ignore
    this.comments = null;
    this.currentPage = 1;
    this.totalPages = 1;
    this.loadUser(this.attrs.username);
    this.getUserComments();
    this.userWhoCommented = null;
    this.refresh = false;
  }

  async getUserComments(page = 1, pageSize = 10): Promise<ApiResponsePlural<UserComment>> {
    this.loading = true;

    const paginationParams = {
      page: {
        number: page,
        size: pageSize
      },
      filter: {
        userId: this.user.id()
      }
    };

    this.comments = await app.store.find('user_comments', paginationParams);
    this.currentPage = page;
    this.totalPages = this.comments.payload.meta.totalPages;
    this.loading = false;
    m.redraw();
  }

  async createComment(uid: string | number, title: string, comment: string) {
    this.loading = true;
    try {
      await app.request({
        method: 'POST',
        url: `${app.forum.attribute('apiUrl')}/user_comments`,
        body: {
          data: {
            attributes: {
              comment_title: title,
              comment: comment,
            },
            relationships: {
              user: {
                data: {
                  type: 'users',
                  id: uid,
                },
              },
            },
          },
        },
      });

      m.redraw();
      app.alerts.show({ type: 'success' }, getTranslation('forum', 'alertCommentCreated'));
    } catch (error) {
      app.alerts.show('error', getTranslation('forum', 'alertCommentError'));
    } finally {
      this.loading = false;
    }
  }

  shouldRefresh() {
    this.refresh = this.refresh !== true;
  }

  oncreate(vnode: Mithril.VnodeDOM<IUserPageAttrs, this>) {
    super.oncreate(vnode);
  }

  view(): JSX.Element {
    const meta = this.comments && this.comments.payload.meta

    if (!app.session.user) {
      return (
        <div className="UserPage">
            <div className="container">
              <div className="sideNavContainer">
                <nav className="sideNav UserPage-nav">
                  <ul>{listItems(this.sidebarItems().toArray())}</ul>
                </nav>
                <div className="sideNavOffset UserPage-content">
                  <div className="PostsUserPage">
                    <div className="profile-comment-actions">
                      <h2>{app.translator.trans('justoverclock-profile-comments.forum.commentsPageLink')}</h2>
                    </div>
                    <div>
                      {getTranslation('forum', 'pleaseLoginMessage')}
                    </div>
                </div>
              </div>
            </div>
        </div>
        </div>
      )
    }

    return (
      <div className="UserPage">
        {this.user ? (
          <div className="container">
            <div className="sideNavContainer">
              <nav className="sideNav UserPage-nav">
                <ul>{listItems(this.sidebarItems().toArray())}</ul>
              </nav>
              <div className="sideNavOffset UserPage-content">
                <div className="PostsUserPage">
                  <div className="profile-comment-actions">
                    <h2>{app.translator.trans('justoverclock-profile-comments.forum.commentsPageLink')}</h2>
                  </div>
                  <div>
                    {this.comments &&
                      this.comments.payload.data.map((comment) => (
                        <SingleComment
                          user={this.user}
                          title={comment.attributes.comment_title}
                          comment={comment.attributes.comment}
                          commentedAt={comment.attributes.createdAt}
                          commentedBy={comment.attributes}
                          relToUser={comment.attributes.related_to_user}
                          refreshComments={this.getUserComments.bind(this)}
                        />
                      ))}
                  </div>
                  <div className="profile-comment-pagination">
                    <button
                      class="Button"
                      disabled={this.currentPage === 1}
                      onclick={() => {
                        if (this.currentPage > 1) {
                          this.getUserComments(this.currentPage - 1);
                        }
                      }}
                    >
                      {getTranslation('forum', 'previousPage')}
                    </button>
                    <button
                      class="Button"
                      disabled={this.currentPage === this.totalPages}
                      onclick={() => {
                        if (this.currentPage < this.totalPages) {
                          this.getUserComments(this.currentPage + 1);
                        }
                      }}
                    >
                      {getTranslation('forum', 'nextPage')}
                    </button>
                  </div>
                  {this.user.id().toString() !== app.session.user.data.id ? (
                    <LeaveCommentArea
                      onInteraction={() => {
                        app.modal.show(AddCommentModal, {
                          userId: this.user.id(),
                          createComment: this.createComment,
                          refreshComments: this.getUserComments.bind(this),
                        });
                      }}
                      userAvatarUrl={app.session.user.data.attributes.avatarUrl || `https://placehold.co/25?text=${app.session.user.data.attributes.username.charAt(0).toUpperCase()}`}
                      placeholder={getTranslation('forum', 'leaveComment')}
                    />
                  ) : (
                    <LeaveCommentArea
                      userAvatarUrl={app.session.user.data.attributes.avatarUrl || `https://placehold.co/25?text=${app.session.user.data.attributes.username.charAt(0).toUpperCase()}`}
                      placeholder={getTranslation('forum', 'cantComment')}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <LoadingIndicator display="block" />
        )}
      </div>
    );
  }
}
