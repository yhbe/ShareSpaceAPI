# ShareSpaceAPI

RESTful API that powers [ShareSpace](https://github.com/yhbe/ShareSpace), a Facebook-inspired social network. It handles accounts, authentication, friend requests, posts, and comments.

## Features

| Feature | Details |
| --- | --- |
| Authentication | Sign up and log in with bcrypt-hashed passwords; sessions persist through JWTs stored in cookies |
| Friends | Send and accept friend requests |
| Posts and comments | Create and delete posts; add and delete comments |

## Endpoints

All routes are mounted under `/users`.

| Method | Route | Purpose |
| --- | --- | --- |
| POST | `/users` | Create an account |
| GET | `/users` | List all users |
| POST | `/users/login` | Log in |
| GET | `/users/loginWithCookies` | Restore a session from the JWT cookie |
| POST | `/users/logout` | Log out |
| POST | `/users/userPost` | Create a post |
| DELETE | `/users/deletePost` | Delete a post |
| POST | `/users/addComment` | Comment on a post |
| DELETE | `/users/deleteComment` | Delete a comment |
| POST | `/users/sendFriendRequest` | Send a friend request |
| POST | `/users/acceptFriendRequest` | Accept a friend request |

## Tech

Node.js, Express, MongoDB, Mongoose, JSON Web Tokens, bcrypt

## Project structure

| Folder | Contents |
| --- | --- |
| `routes/` | Endpoint definitions |
| `controller/` | Request handling logic |
| `models/` | Mongoose schemas |
| `utils/` | Database connection |

## Run locally

1. Run `npm install`.
2. 2. Create a `.env` file with `DB_URL` (your MongoDB connection string) and `JWT_SECRET` (any random string). Optionally set `PORT`; it defaults to 5000.
   3. 3. Run `npm start`.
      4. 
