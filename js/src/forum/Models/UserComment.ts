import Model from 'flarum/common/Model';

export default class UserComment extends Model {
  commentTitle = Model.attribute('comment_title');
  comment = Model.attribute('comment');
  commentedBy = Model.attribute('commented_by');
  createdAt = Model.attribute('createdAt', Model.transformDate);
  updatedAt = Model.attribute('updatedAt', Model.transformDate);

  static getRelations() {
    return {
      user: Model.hasOne('users'),
    };
  }
}
