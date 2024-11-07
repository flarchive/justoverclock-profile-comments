import app from 'flarum/admin/app';
import ProfileCommentsSettingPage from "./components/ProfileCommentsSettingPage";

app.initializers.add('justoverclock/profile-comments', () => {
  app
    .extensionData
    .for('justoverclock-profile-comments')
    .registerPage(ProfileCommentsSettingPage)
});
