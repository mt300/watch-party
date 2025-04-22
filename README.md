## Immidee Watch Party Project

In this takehome project, we want to understand your:

- ability to build non-trivial applications and unit/e2e tests
- comfort picking up unfamiliar technologies
- architectural decisions, abstractions, and rigor

We want to respect your time, so please try not to spend more than 6 hours on this. We know that this is a challenging task & you are under time pressure and will keep that in mind when evaluating your solution.

### Instructions

- Create a firestore database https://console.firebase.google.com
- Create the .env file and update the FIREBASE_CONFIG data
- Run the app simply "npm i" and then "npm dev"

### Problem

This is a collaborative “Watch Party” app that lets a distributed group of users watch youtube videos together. The frontend is written in Typescript. The app should have two main pages:

- `/create` **Create a new session**
  - by giving it a name and a youtube video link. After creating a session `ABC`, you should be automatically redirected to the page `/watch` page for that session
- `/watch/:sessionId` **Join an existing session**
  _⚠️ The player must be **synced for all users at all times** no matter when they join the party_
  - **Playing/pausing/seek** the video. When someone plays/pauses the video or jumps to a certain time in the video, this should update for everyone in the session
  - **Late to the party**... Everything should stay synced if a user joins the session late (e.g. if the video was already playing, the new user should see it playing at the correct time)

### Assumptions

- This app obviously **doesn’t need to be production-ready**, but you should at least be aware of any issues you may encounter in more real-world scenarios.
- We gave you all of the frontend UX you’ll need, including skeleton pages for the `create` and `watch` routes, so you can focus on implementing the unit-testing logic for the app.
- All components are in the main route "./routes/\_index.tsx", we expect you to create the missing routes and move/update the components accordingly
- In case you face any missing functionality we expect you to create a test together with the solution

### Required Unit Tests

- [ X] **Creating a session**. Any user should be able to create a session to watch a given Youtube video.
- [X ] **Joining a session**. Any user should be able to join a session created by another user using the shareable session link.
- [X ] **Playing/pausing** the video. When a participant pauses the video, it should pause for everyone. When a participant plays the video, it should start playing for everyone.
- [ X] **“Seek”**. When someone jumps to a certain time in the video it should jump to that time for everyone.
- [ X] **Late to the party**... Everything should stay synced even if a user joins the watch party late (e.g. the video is already playing)
- [ X] **Player controls.** All the player controls (e.g. play, pause, and seek) should be intuitive and behave as expected.


OBS: I could not make the tests run due to an error with Remix + Vitest, but the functionalities can be used properly if you run mannually. In this kind of situation I would ask for a few more hours to understand better the problem and fix it.

🚨 **Please fill out the rubric in the README with the functionality you were able to complete**

### Architecture Questions

After building the watch party app, we would like you to answer the following questions about design decisions and tradeoffs you made while building it. Please fill them out in the README along with your submission.

1. **How do you guarantee that the time that a new user joins is accurate (i.e perfectly in sync with the other users in the session) and are there any edge cases where it isn’t? Think about cases that might occur with real production traffic.**
  We keep late joiners in sync by saving the video’s current timestamp along with the exact moment it was last updated (updatedAt). When a new user joins the session, we check how much time has passed since that last update and move the video forward accordingly, so they jump to the right spot.
  This works well in most cases, but there can be some edge cases — like small differences in users’ device clocks, network delays, or two users trying to update the video at the same time. To handle this, we ignore very small time differences (less than 0.3 seconds) and listen to real-time updates through Firestore.
  For even better accuracy in production, we could improve this by syncing all users’ clocks or using a backend timestamp instead of each user’s local time.

2. **Are there any other situations - i.e race conditions, edge cases - where one user can be out of sync with another? (Out of sync meaning that user A has the video playing or paused at some time, while user B has the video playing or paused at some other time.)**
  Yes, if two users press play, pause, or seek at nearly the same time, both updates may conflict. Also network and clock delays can results on miss real time updates from database. 
3. **How would you productionize this application to a scale where it needs to be used reliably with 1M+ DAUs and 10k people connected to a single session? Think infrastructure changes, code changes & UX changes.**
  Infra:
    Replace Firestone with websockets probablly, introduce a pub-sub layer (like Redis) to broadcast updates between socket instances and use some cache strategies to reduce unnecessary requests
  UX:
    Show real-time status feedback (e.g., “You’re 1.2s behind — resyncing...”).
    Adaptive sync intervals based on device/network performance
    Split session control into authoritative(controlls player) + passive users(consume passively) so the average experience would seen less chaotic and more joinfull.
    Add visual indicators of who’s controlling the session.
    Role-based controls (only some users can seek or pause)

### Help & Clarifications

Feel free to use any resource on the Internet to help you tackle this challenge better: guides, technical documentation, sample projects on Github — anything is fair game! We want to see how you can build things in a real working environment where no information is off limits.

### Submission

When you’ve finished, please create a repository with your solution and share the link via email (regis@immidee.tech). Make sure to include any instructions about how to run the app in the README.md.
