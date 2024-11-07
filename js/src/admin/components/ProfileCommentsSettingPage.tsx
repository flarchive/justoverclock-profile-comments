// @ts-nocheck
import ExtensionPage, {ExtensionPageAttrs} from 'flarum/admin/components/ExtensionPage';
import app from 'flarum/admin/app';
import Mithril from "mithril";
import {ApiResponsePlural} from "flarum/common/Store";
import UserComment from "../../forum/Models/UserComment";
import {getTranslation} from "../../forum/utils/getTranslation";
import LoadingIndicator from "flarum/common/components/LoadingIndicator";

export default class ProfileCommentsSettingPage extends ExtensionPage {

  oninit(vnode: Mithril.Vnode<ExtensionPageAttrs, this>) {
    super.oninit(vnode);
    this.loading = false;
    this.comments = null;
    this.currentPage = 1;
    this.totalPages = 1;
    this.getUserComments()
  }

  oncreate(vnode: Mithril.VnodeDOM<ExtensionPageAttrs, this>) {
    super.oncreate(vnode);
  }

  async deleteComment(commentId: string) {
    this.loading = true
    await app.request({
      method: 'DELETE',
      url: `${app.forum.attribute('apiUrl')}/user-comment-delete/${commentId}`,
    });
    this.getUserComments()
    this.loading = false;
  }

  async getUserComments(page = 1, pageSize = 30): Promise<ApiResponsePlural<UserComment>> {
    this.loading = true;

    const paginationParams = {
      page: {
        number: page,
        size: pageSize
      },
    };

    this.comments = await app.store.find('user_comments_admin', paginationParams);
    this.currentPage = page;
    this.totalPages = this.comments.payload.meta.totalPages;
    this.loading = false;
    m.redraw();
  }

  content(vnode: Mithril.VnodeDOM<ExtensionPageAttrs, this>): JSX.Element {
    return (
      <div className='container'>
        <div className='profile-comment-admin-list'>

          <table class='profile-comment-admin-list-table'>
            <thead>
            <tr>
              <th className="UserListPage-grid-header">
                {getTranslation('admin', 'id')}
              </th>
              <th className="UserListPage-grid-header">
                {getTranslation('admin', 'userId')}
              </th>
              <th className="UserListPage-grid-header">
                {getTranslation('admin', 'commentedBy')}
              </th>
              <th className="UserListPage-grid-header">
                {getTranslation('admin', 'title')}
              </th>
              <th className="UserListPage-grid-header">
                {getTranslation('admin', 'comment')}
              </th>
              <th className="UserListPage-grid-header">
                {getTranslation('admin', 'delete')}
              </th>
            </tr>
            </thead>
            <tbody>
            {this.loading && (
              <LoadingIndicator />
            )}
            {!this.loading && this.comments && this.comments.payload.data.map(comment => {
              const {attributes} = comment;
              console.log(attributes)
              return (
                <tr>
                  <td>{attributes.id}</td>
                  <td>{attributes.related_to_user.id}</td>
                  <td>{attributes.commented_by.id}</td>
                  <td>{attributes.comment_title}</td>
                  <td className='comment-cell'>{attributes.comment}</td>
                  <td>
                    <button
                      onclick={() => this.deleteComment(attributes.id)}
                      class="Button"
                    >
                      <i class="fas fa-trash" style={{ color: 'red' }}></i>
                    </button>
                  </td>
                </tr>
              )
            })}
            </tbody>
          </table>
          <div className="profile-comment-admin-pagination">
            <button
              class="Button"
              disabled={this.currentPage === 1}
              onclick={() => {
                if (this.currentPage > 1) {
                  this.getUserComments(this.currentPage - 1);
                }
              }}
            >
              {getTranslation('admin', 'previousPage')}
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
              {getTranslation('admin', 'nextPage')}
            </button>
          </div>
        </div>
      </div>
    );
  }
}
