import app from 'flarum/forum/app';

export const getTranslation = (ctx: string, key: string) => {
  return app.translator.trans(`justoverclock-profile-comments.${ctx}.${key}`);
};
