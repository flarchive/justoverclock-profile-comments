import { ComponentAttrs } from 'flarum/common/Component';
import User from 'flarum/common/models/User';

export interface SingleCommentProps extends ComponentAttrs {
  user: User | null;
  title: string;
  comment: string;
  commentedBy: string;
  commentedAt: Date | string;
  relToUser: any;
}

export interface LeaveCommentAreaProps extends ComponentAttrs {
  placeholder: string;
  onInteraction?: () => void;
  userAvatarUrl: string
}
