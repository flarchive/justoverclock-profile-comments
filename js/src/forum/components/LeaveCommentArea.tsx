import Component, { ComponentAttrs } from 'flarum/common/Component';
import Mithril from 'mithril';
import { LeaveCommentAreaProps } from '../types';

export default class LeaveCommentArea extends Component<LeaveCommentAreaProps> {
  oninit(vnode: Mithril.Vnode<ComponentAttrs, this>) {
    super.oninit(vnode);
  }

  oncreate(vnode: Mithril.VnodeDOM<ComponentAttrs, this>) {
    super.oncreate(vnode);
  }

  view(vnode: Mithril.Vnode<ComponentAttrs, this>): Mithril.Children {
    return (
      <button onclick={this.attrs.onInteraction} class="Post ReplyPlaceholder">
        <span class="Post-header">
          <img class="Avatar PostUser-avatar" loading="lazy" src={this.attrs.userAvatarUrl} alt="" />
          {this.attrs.placeholder}
        </span>
      </button>
    );
  }
}
