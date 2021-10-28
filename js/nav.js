'use strict';

$body.on('click', '#nav-all', navAllStories);

function navAllStories(e) {
  console.debug('navAllStories', e);

  hidePageComponents();
  putStoriesOnPage();
}

// *****************************************************************************
$navSubmitStory.on('click', navSubmitStoryClick);

function navSubmitStoryClick(e) {
  console.debug('navSubmitStoryClick', e);

  hidePageComponents();

  $allStoriesList.show();
  $submitForm.show();
}

// *****************************************************************************
$body.on('click', '#nav-favorites', navFavoritesClick);

function navFavoritesClick(e) {
  console.debug('navFavoritesClick', e);

  hidePageComponents();
  putFavoritesListOnPage();
}

// *****************************************************************************
$body.on('click', '#nav-my-stories', navMyStories);

function navMyStories(e) {
  console.debug('navMyStories', e);

  hidePageComponents();
  putUserStoriesOnPage();

  $ownStories.show();
}

// *****************************************************************************
$navLogin.on('click', navLoginClick);

function navLoginClick(e) {
  console.debug('navLoginClick', e);

  hidePageComponents();

  $loginForm.show();
  $signupForm.show();
}

// *****************************************************************************
$navUserProfile.on('click', navProfileClick);

function navProfileClick(e) {
  console.debug('navProfileClick', e);

  hidePageComponents();

  $userProfile.show();
}

// *****************************************************************************

//* After user login, update the navbar

function updateNavOnLogin() {
  console.debug('updateNavOnLogin');

  $('.main-nav-links').show();
  $navLogin.hide();
  $navLogOut.show();

  $navUserProfile.text(`${currentUser.username}`).show();
}
