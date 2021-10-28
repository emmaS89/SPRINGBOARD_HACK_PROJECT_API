'use strict';

let currentUser;

// ******************************************************************************

// * User Signup
$signupForm.on('submit', signup);

async function signup(e) {
  console.debug('signup', e);
  e.preventDefault();

  const name = $('#signup-name').val();
  const username = $('#signup-username').val();
  const password = $('#signup-password').val();

  currentUser = await User.signup(username, password, name);

  saveUserCredentialsInLocalStorage();

  $signupForm.trigger('reset');
}

// ******************************************************************************

// * User Login
$loginForm.on('submit', login);

async function login(e) {
  console.debug('login', e);
  e.preventDefault();

  const username = $('#login-username').val();
  const password = $('#login-password').val();

  currentUser = await User.login(username, password);

  $loginForm.trigger('reset');

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();
}

// ******************************************************************************

// * User Logout
$navLogOut.on('click', logout);

function logout(evt) {
  console.debug('logout', evt);

  localStorage.clear();
  location.reload();
}

// ******************************************************************************

// * setItem to LS
function saveUserCredentialsInLocalStorage() {
  console.debug('saveUserCredentialsInLocalStorage');

  if (currentUser) {
    localStorage.setItem('token', currentUser.loginToken);
    localStorage.setItem('username', currentUser.username);
  }
}

// * getItem from LS
async function checkForRememberedUser() {
  console.debug('checkForRememberedUser');

  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  if (!token || !username) return false;

  // if login failed, Credentials will be null
  currentUser = await User.loginViaStoredCredentials(token, username);
}

// ****************************************************************************

// * Generate User profile
function generateUserProfile() {
  console.debug('generateUserProfile');

  $('#profile-name').text(currentUser.name);
  $('#profile-username').text(currentUser.username);
  $('#profile-account-date').text(currentUser.createdAt.slice(0, 10));
}

// * Update UI after login the user
function updateUIOnUserLogin() {
  console.debug('updateUIOnUserLogin');

  hidePageComponents();

  // re-display stories (so that "favorite" stars can appear)
  putStoriesOnPage();

  $allStoriesList.show();

  updateNavOnLogin();
  generateUserProfile();
}
