// @ts-nocheck
type TranslationContext = 'admin' | 'forum'

export const getTranslation = (ctx: TranslationContext, key: string) => {
  return app.translator.trans(`justoverclock-profile-comments.${ctx}.${key}`);
};
