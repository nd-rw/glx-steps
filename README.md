# glx-steps
steps 4 glx

## Development

- Initial setup:

  ```sh
  npm run setup
  ```

- Start dev server:

  ```sh
  npm run dev
  ```

This starts your app in development mode, rebuilding assets on file changes.

The database seed script creates a new user with some data you can use to get started:

- Email: `rachel@remix.run`
- Password: `racheliscool`

Other useful commands can be found under "scripts" in `package.json`. 

### Relevant code:

Hacked together from a note-taking app example. The main functionality is:
- creating users
- logging in and out
- creating/viewing/deleting step entries
- leaderboard

- creating users, and logging in and out [./app/models/user.server.ts](./app/models/user.server.ts)
- user sessions, and verifying them [./app/session.server.ts](./app/session.server.ts)
- creating step entries, viewing step entries and leaderboard [./app/models/note.server.ts](./app/models/stepEntry.server.ts)
