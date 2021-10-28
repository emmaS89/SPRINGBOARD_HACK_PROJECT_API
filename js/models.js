'use strict';

const BASE_URL = 'https://hack-or-snooze-v3.herokuapp.com';

// ******************************************************************************

/*

-- STORY --
{
  "story": {
    "author": "Matt Lane",
    "createdAt": "017-11-09T18:38:39.409Z",
    "storyId": "5081e46e-3143-4c0c-bbf4-c22eb11eb3f5",
    "title": "The Best Story Ever",
    "updatedAt": "017-11-09T18:38:39.409Z",
    "url": "https://www.rithmschool.com/blog/do-web-developers-need-to-be-good-at-math",
    "username": "hueter"
  }
}



*/

class Story {
  /** Make instance of Story from data object about story:
   *   - {title, author, url, username, storyId, createdAt}
   */

  constructor({ storyId, title, author, url, username, createdAt }) {
    this.storyId = storyId;
    this.title = title;
    this.author = author;
    this.url = url;
    this.username = username;
    this.createdAt = createdAt;
  }
  getHostName() {
    return new URL(this.url).hostname;
  }
}

// *****************************************************************************

/*
-- StroyList --

- Add a Story -
Token Required. The fields username, title, author, and url are required.

{
  "story": {
    "author": "Matt Lane",
    "createdAt": "017-11-09T18:38:39.409Z",
    "storyId": "5081e46e-3143-4c0c-bbf4-c22eb11eb3f5",
    "title": "The Best Story Ever",
    "updatedAt": "017-11-09T18:38:39.409Z",
    "url": "https://www.rithmschool.com/blog/do-web-developers-need-to-be-good-at-math",
    "username": "hueter"
  }
}

- Delete a Story -
Token Required. Correct User Required. Remove a single story document by storyId.

*/

class StoryList {
  constructor(stories) {
    this.stories = stories;
  }

  /** Generate a new StoryList. It:
   *
   *  - calls the API
   *  - builds an array of Story instances
   *  - makes a single StoryList instance out of that
   *  - returns the StoryList instance.
   */

  static async getStories() {
    // Note presence of `static` keyword: this indicates that getStories is
    //  **not** an instance method. Rather, it is a method that is called on the
    //  class directly. Why doesn't it make sense for getStories to be an
    //  instance method?

    // query the /stories endpoint (no auth required)
    const res = await axios({
      url: `${BASE_URL}/stories`,
      method: 'GET',
    });

    const stories = res.data.stories.map((story) => new Story(story));

    return new StoryList(stories);
  }

  /** Adds story data to API, makes a Story instance, adds it to story list.
   * - user - the current instance of User who will post the story
   * - obj of {title, author, url}
   *
   * Returns the new Story instance
   */

  // * Add a New Story
  async addStory(user, { title, author, url }) {
    const token = user.loginToken;
    const res = await axios({
      method: 'POST',
      url: `${BASE_URL}/stories`,
      data: { token, story: { title, author, url } },
    });
    const story = new Story(res.data.story);

    this.stories.unshift(story);
    user.ownStories.unshift(story);

    return story;
  }

  // * Delete a Story
  async deleteStory(user, storyId) {
    const token = user.loginToken;
    await axios({
      url: `${BASE_URL}/stories/${storyId}`,
      method: 'DELETE',
      data: { token: user.loginToken },
    });
    this.stories = this.stories.filter((story) => story.storyId !== storyId);

    // * ASK?? Correct
    // if (this.stories.storyId !== storyId) {
    //   retun this.stories
    // }

    user.favorites = user.favorites.filter(
      (favorite) => favorite.storyId !== storyId
    );
    user.ownStories = user.ownStories.filter(
      (ownStory) => ownStory.storyId !== storyId
    );
  }
}

// ******************************************************************************
/*

--USER --
{
  "token": "eyJhbGciO...",
  "user": {
    "createdAt": "017-11-09T18:38:39.409Z",
    "favorites": [
      {
        "author": "Matt Lane",
        "createdAt": "017-11-09T18:38:39.409Z",
        "storyId": "5081e46e-3143-4c0c-bbf4-c22eb11eb3f5",
        "title": "The Best Story Ever",
        "updatedAt": "017-11-09T18:38:39.409Z",
        "url": "https://www.rithmschool.com/blog/do-web-developers-need-to-be-good-at-math",
        "username": "hueter"
      }
    ],
    "name": "Michael Hueter",
    "password": "foo123",
    "stories": [
      {
        "author": "Matt Lane",
        "createdAt": "017-11-09T18:38:39.409Z",
        "storyId": "5081e46e-3143-4c0c-bbf4-c22eb11eb3f5",
        "title": "The Best Story Ever",
        "updatedAt": "017-11-09T18:38:39.409Z",
        "url": "https://www.rithmschool.com/blog/do-web-developers-need-to-be-good-at-math",
        "username": "hueter"
      }
    ],
    "updatedAt": "017-11-09T18:38:39.409Z",
    "username": "hueter"
  }
}

- Signup - ( token required )
{
  "user": {
    "name": "Test User",
    "username": "test",
    "password": "password"
  }
}

- Login -
{
  "user": {
    "username": "test",
    "password": "password"
  }
}

- Get User - (loginViaStoredCredentials)
Token Required. Retrieve a single user document by username.

*/

class User {
  /** Make user instance from obj of user data and a token:
   *   - {username, name, createdAt, favorites[], ownStories[]}
   *   - token
   */

  constructor(
    { username, name, createdAt, favorites = [], ownStories = [] },
    token
  ) {
    this.username = username;
    this.name = name;
    this.createdAt = createdAt;

    // instantiate Story instances for the user's favorites and ownStories
    this.favorites = favorites.map((favorite) => new Story(favorite));
    this.ownStories = ownStories.map((ownStory) => new Story(ownStory));

    // store the login token on the user so it's easy to find for API calls.
    this.loginToken = token;
  }

  // * User Signup
  static async signup(username, password, name) {
    const res = await axios({
      url: `${BASE_URL}/signup`,
      method: 'POST',
      data: { user: { username, password, name } },
    });

    let { user } = res.data;
    console.log('{user}: ', { user });

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories,
      },
      res.data.token
    );
  }

  // * User Login
  static async login(username, password) {
    const res = await axios({
      url: `${BASE_URL}/login`,
      method: 'POST',
      data: { user: { username, password } },
    });

    let { user } = res.data;

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories,
      },
      res.data.token
    );
  }

  // * loginViaStoredCredentials
  static async loginViaStoredCredentials(token, username) {
    try {
      const res = await axios({
        url: `${BASE_URL}/users/${username}`,
        method: 'GET',
        params: { token },
      });

      let { user } = res.data;

      return new User(
        {
          username: user.username,
          name: user.name,
          createdAt: user.createdAt,
          favorites: user.favorites,
          ownStories: user.stories,
        },
        token
      );
    } catch (e) {
      console.error('loginViaStoredCredentials failed', e);
      return null;
    }
  }

  // * Add User Favorite Story
  async addUserFavoriteStory(story) {
    this.favorites.push(story);
    await this._addOrDeleteFavoriteStory('add', story);
  }

  // * Delete User Favorite Story
  async deleteUserFavoriteStory(story) {
    this.favorites = this.favorites.filter(
      (favorite) => favorite.storyId !== story.storyId
    );
    await this._addOrDeleteFavoriteStory('delete', story);

    // * ASK: Without filter method ?
    // if(favorite.storyId !== story.storyId) {
    //   return this.favorites
    // }
  }

  // * POST or DELETE Method For Favorite Story
  async _addOrDeleteFavoriteStory(newState, story) {
    const method = newState === 'add' ? 'POST' : 'DELETE';
    const token = this.loginToken;
    await axios({
      url: `${BASE_URL}/users/${this.username}/favorites/${story.storyId}`,
      method: method,
      data: { token },
    });
  }

  // * Check if the story is favorite? ( Invoke the func => Stories.js favorite/not-favorite star for story)
  isFavoriteStory(story) {
    return this.favorites.some(
      (favorite) => favorite.storyId === story.storyId
    );
  }
}
