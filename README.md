# Stories

A demo app.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Enviroment Variables

* `NEXT_PUBLIC_API_URL` - URL of the REST API to fetch data from
* `OPENAI_API_KEY` - Used for generating stories.

Set up your local credentials with `cp .env.example .env` and fill in the missing values.

## Design notes

Done:

* Desktop-first design
* Matches Inter font from Figma
* HeroIcons for icons
* Story viewer is client-only and doesn't have permalink
* Relies on api to sort users + stories initially

TODO:
* Dynamic URLs + page titles for image viewer
* Better error handling
* Loading additional users

## REST API Design

Although this application uses static data, the following REST endpoints could serve this application in a real-world scenario.

### 1. Get User Stories

**Endpoint:**

```
GET /api/stories
```

**Description:**

Fetches a paginated list of users and their stories.

**Query Parameters:**

- `page` (integer): Page number for pagination.
- `limit` (integer): Number of users per page.

**Response:**

```json
{
  "users": [
    {
      "userId": 1,
      "username": "john_doe",
      "profilePicture": "/images/profiles/john_doe.jpg",
      "stories": [
        {
          "id": 1,
          "imageUrl": "/images/stories/john_doe_1.jpg",
          "viewed": false
        },
        // More stories...
      ]
    },
    // More users...
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "totalUsers": 50
  }
}
```

### 2. Get Stories for a Specific User

**Endpoint:**

```
GET /api/users/:userId/stories
```

**Description:**

Fetches all stories for a specific user.

**Parameters:**

- `userId` (integer): ID of the user.

**Response:**

```json
{
  "userId": 1,
  "username": "john_doe",
  "stories": [
    {
      "id": 1,
      "imageUrl": "/images/stories/john_doe_1.jpg",
      "viewed": false
    },
    // More stories...
  ]
}
```

### 3. Search Users

**Endpoint:**

```
GET /api/users/search
```

**Description:**

Searches for users by username.

**Query Parameters:**

- `query` (string): The search term.
- `page` (integer): Page number for pagination.
- `limit` (integer): Number of results per page.

**Response:**

```json
{
  "users": [
    {
      "userId": 2,
      "username": "jane_smith",
      "profilePicture": "/images/profiles/jane_smith.jpg"
    },
    // More users...
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalPages": 2,
    "totalResults": 15
  }
}
```

### 4. Mark Story as Viewed

**Endpoint:**

```
POST /api/stories/:storyId/viewed
```

**Description:**

Marks a story as viewed.

**Parameters:**

- `storyId` (integer): ID of the story.

**Response:**

```json
{
  "success": true,
  "message": "Story marked as viewed."
}
```

### Pagination and Searches

- **Pagination**: Implemented via `page` and `limit` query parameters.
- **Searches**: The `/api/users/search` endpoint supports searching users by username with pagination.
