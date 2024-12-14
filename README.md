# Stories

A demo app implementing a social media story viewer.

Check it out at: [stories-beige.vercel.app](https://stories-beige.vercel.app/)

**Note:** Story images are generated with OpenAI Dall-E, so they will take a few seconds to load initially. But, after that they should be cached in the browser and the experience will be faster.


## Development

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Enviroment Variables

* `NEXT_PUBLIC_BASE_URL` - URL of the API, used to fetch data
* `OPENAI_API_KEY` - Used for generating stories.

Set up your local credentials with `cp .env.example .env` and fill in the missing values.

## Design notes

Done:

* Desktop-first design
* Inter font
* HeroIcons for icons
* Loads story data dynamically via api call
* Story viewer is client-only and doesn't have permalink
* Relies on api to sort users + stories initially
* Sends a "viewed" event to the API when a story is viewed, being careful to only triger if it's been loaded

TODO:
* Dynamic URLs + page titles for image viewer
* Better error handling
* Loading additional users
* Persisting data

## Proposed REST API Design

Although this application uses static data, the following REST endpoints could serve this application in a real-world scenario.

### 1. Get User Stories

**Endpoint:**

```
GET /api/stories
```

**Description:**

Fetches a list of users and their stories, ordered by the timestamp of their latest story. Pagination is handled via the `latest_story_at` parameter, which allows loading newer or older data.

**Query Parameters:**

- `latest_story_before` (ISO 8601 date/time string, optional): Returns users whose latest story was created before this timestamp. Used for pagination.
- `latest_story_after` (ISO 8601 date/time string, optional): Returns users whose latest story was created after this timestamp. Used for loading newer data.
- `limit` (integer, optional): Number of users to return per request. Default to 10.


**Note:** Refreshing stories this way requires the state store to de-duplicate users and stories.

**Response:**

```json
{
  "users": [
    {
      "userId": "e8b5e17b-f060-4d34-bfef-df6979d40c3c",
      "username": "john_doe",
      "profilePicture": "/images/profiles/john_doe.jpg",
      "latest_story_at": "2023-10-01T12:34:56Z",
      "stories": [
        {
          "id": "a13f0c33-2773-4e5f-b428-29a987c43d9d",
          "imageUrl": "/images/stories/john_doe_1.jpg",
          "viewed": false,
          "created_at": "2023-10-01T12:00:00Z"
        }
        // More stories...
      ]
    }
    // More users...
  ]
}

### 2. Get Stories for a Specific User

**Endpoint:**

```
GET /api/users/:userId/stories
```

**Description:**

Fetches all stories for a specific user, ordered by their creation timestamp.

**Parameters:**

- `userId` (string): UUID of the user.

**Response:**

```json
{
  "userId": "e8b5e17b-f060-4d34-bfef-df6979d40c3c",
  "username": "john_doe",
  "latest_story_at": "2023-10-01T12:34:56Z",
  "stories": [
    {
      "id": "a13f0c33-2773-4e5f-b428-29a987c43d9d",
      "imageUrl": "/images/stories/john_doe_1.jpg",
      "viewed": false,
      "created_at": "2023-10-01T12:00:00Z"
    }
    // More stories...
  ]
}
```

### 3. Mark Story as Viewed

**Endpoint:**

```
POST /api/stories/:storyId/viewed
```

**Description:**

Marks a story as viewed by the current user.

**Parameters:**

- `storyId` (string): UUID of the story.

**Response:**

```json
{
  "success": true,
  "message": "Story marked as viewed."
}
```

### Pagination and Loading Stories

- **Pagination**: Implemented via the `latest_story_before` and `latest_story_after` query parameters. This allows clients to load more recent or older users based on the timestamp of their latest story.
- **Example Usage**:
  - To load users with latest stories before a certain time:
    ```
    GET /api/stories?latest_story_before=2023-10-01T00:00:00Z&limit=10
    ```
  - To load users with latest stories after a certain time:
    ```
    GET /api/stories?latest_story_after=2023-10-02T00:00:00Z&limit=10
    ```

- **Limit**: The `limit` query parameter specifies the maximum number of users to return per request.

### Notes

- All IDs are UUID strings to prevent enumeration attacks.
- All timestamps are in ISO 8601 format in UTC.
- The `created_at` field represents when a story was created.
- The `latest_story_at` field on user objects represents the creation time of the user's most recent story.

