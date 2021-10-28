'use strict';

// So we don't have to keep re-finding things on page, find DOM elements once:

const $body = $('body');

// * Nav User
const $navSubmitStory = $('#nav-submit-story');
const $navLogin = $('#nav-login');
const $navUserProfile = $('#nav-user-profile');
const $navLogOut = $('#nav-logout');
const $submitForm = $('#submit-form');

// * Stories
const $storiesLoadingMsg = $('#stories-loading-msg');
const $allStoriesList = $('#all-stories-list');
const $favoritedStories = $('#favorited-stories');
const $ownStories = $('#my-stories');

// * ol (class)
const $storiesLists = $('.stories-list');

// * User Form
const $loginForm = $('#login-form');
const $signupForm = $('#signup-form');
const $userProfile = $('#user-profile');

// ************************************************************************************************

function hidePageComponents() {
  const components = [
    $submitForm,
    $storiesLists,
    $loginForm,
    $signupForm,
    $userProfile,
  ];
  components.forEach((component) => component.hide());
}

/** Overall function to kick off the app. */

async function start() {
  console.debug('start');

  // "Remember logged-in user" and log in, if credentials in localStorage
  await checkForRememberedUser();
  await getAndShowStoriesOnStart();

  // if we got a logged-in user
  if (currentUser) updateUIOnUserLogin();
}

// Once the DOM is entirely loaded, begin the app

console.warn(
  'HEY STUDENT: This program sends many debug messages to' +
    " the console. If you don't see the message 'start' below this, you're not" +
    ' seeing those helpful debug messages. In your browser console, click on' +
    " menu 'Default Levels' and add Verbose"
);
$(start);
