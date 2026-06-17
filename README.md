## Unit Assignment: Flixster

Submitted by: **Reyna**

Estimated time spent: **21** hours spent in total

### Application Features

#### REQUIRED FEATURES

- [x] **Display Movies**
  - [x] Users can view a list of current movies from The Movie Database API in a grid view.
    - [x] Movie tiles should be reasonably sized (at least 6 playlists on your laptop when full screen; large enough that the playlist components detailed in the next feature are legible).
  - [x] For each movie displayed, users can see the movie's:
    - [x] Title
    - [x] Poster image
    - [x] Vote average
  - [x] Users can load more current movies by clicking a button which adds more movies to the grid without reloading the entire page. 
- [x] **Search Functionality**
  - [x] Users can use a search bar to search for movies by title.
  - [x] The search bar should include:
    - [x] Text input field
    - [x] Submit/Search button
    - [x] Clear button
  - [x] Movies with a title containing the search query in the text input field are displayed in a grid view when the user either:
    - [x] Presses the Enter key
    - [x] Clicks the Submit/Search button
  - [x] Users can click the Clear button. When clicked:
    - [x] All text in the text input field is deleted
    - [x] The most recent search results are cleared from the text input field and the grid view and all current movies are displayed in a grid view
- [X] **Design Features**
  - [x] Website implements all of the following accessibility features:
    - [x] Semantic HTML
    - [x] [Color contrast](https://webaim.org/resources/contrastchecker/)
    - [x] Alt text for images 
  - [x] Website implements responsive web design.
    - [x] Uses CSS Flexbox or CSS Grid
    - [x] Movie tiles and images shrink/grow in response to window size
  - [x] Users can click on a movie tile to view more details about a movie in a pop-up modal.
    - [x] The pop-up window is centered in the screen and does not occupy the entire screen.
    - [x] The pop-up window has a shadow to show that it is a pop-up and appears floating on the screen.
    - [x] The backdrop of the pop-up appears darker or in a different shade than before. including:
    - [x] The pop-up displays additional details about the moving including:
      - [x] Runtime in minutes
      - [x] Backdrop poster
      - [x] Release date
      - [x] Genres
      - [x] An overview
  - [x] Users can use a drop-down menu to sort movies.
    - [x] Drop-down allows movies to be sorted by:
      - [x] Title (alphabetic, A-Z)
      - [x] Release date (chronologically, most recent to oldest)
      - [x] Vote average (descending, highest to lowest)
    - [x] When a sort option is clicked, movies display in a grid according to selected criterion.
  - [X] Website displays:
    - [x] Header section
    - [X] Banner section
    - [x] Search bar
    - [x] Movie grid
    - [x] Footer section
    - [ ] **VIDEO WALKTHROUGH SPECIAL INSTRUCTIONS**: To ease the grading process, please use the [color contrast checker](https://webaim.org/resources/contrastchecker/) to demonstrate to the grading team that text and background colors on your website have appropriate contrast. The Contrast Ratio should be above 4.5:1 and should have a green box surrounding it. 
- [x] **Planning Documentation**
  - [x] Repository includes a `planning.md` file with:
    - [x] A **Component Architecture** section listing at least 5 components, each with its responsibility, what it renders, and its props.
    - [x] An **API Contracts** section documenting at least 2 TMDb endpoints used, with URL, query parameters, and relevant response fields for each.
    - [x] A **State Architecture** section listing state variables with name, type, initial value, owner component, and what user action triggers an update.
    - [x] A **Data Flow** section (paragraph or diagram) explaining how data flows from the TMDb API response through the component hierarchy to the `MovieCard`, including any transformations.
- [x] **AI Watch Recommendation**
  - [x] When a movie's detail modal is opened, an AI-generated watch recommendation is displayed alongside the movie details.
  - [x] A loading state is shown while the AI response is being generated, and a graceful fallback message is shown if the AI call fails.
  - [x] `planning.md` includes an **AI Feature Spec** documenting role, task, inputs, output format, constraints, and failure behavior for the AI call.
  - [ ] **VIDEO WALKTHROUGH SPECIAL INSTRUCTIONS**: To ease the grading process, open your browser's DevTools **Network** tab, trigger the AI recommendation (open a movie modal), and show the outbound request going **directly to an AI API URL** (e.g., `openrouter.ai`) — not to a backend server URL. Graders need to see this call in the Network tab to award full credit.

#### STRETCH FEATURES

- [ ] **Deployment**
  - [ ] Website is deployed via Render.
  - [ ] **VIDEO WALKTHROUGH SPECIAL INSTRUCTIONS**: For ease of grading, please use the deployed version of your website when creating your walkthrough. 
- [x] **Embedded Movie Trailers**
  - [x] Within the pop-up modal displaying a movie's details, the movie trailer is viewable.
    - [x] When the trailer is clicked, users can play the movie trailer.
- [x] **Favorite Button**
  - [x] For each movie displayed, users can favorite the movie.
  - [x] There should be visual element (such as a heart icon) on each movie's tile to show whether or not the movie has been favorited.
  - [x] If the movie is not favorited:
    - [x] Clicking on the visual element should mark the movie as favorited
    - [x] There should be visual feedback (such as the heart turning a different color) to show that the movie has been favorited by the user.
  - [x] If the movie is already favorited:
    - [x] Clicking on the visual element should mark the movie as *not* favorited.
    - [x] There should be visual feedback (such as the heart turning a different color) to show that the movie has been unfavorited. 
- [x] **Watched Checkbox**
  - [x] For each movie displayed, users can mark the movie as watched.
  - [x] There should be visual element (such as an eye icon) on each movie's tile to show whether or not the movie has been watched.
  - [x] If the movie has not been watched:
    - [x] Clicking on the visual element should mark the movie as watched
    - [x] There should be visual feedback (such as the eye turning a different color) to show that the movie has been watched by the user.
  - [x] If the movie is already watched:
    - [x] Clicking on the visual element should mark the movie as *not* watched.
    - [x] There should be visual feedback (such as the eye turning a different color) to show that the movie has not been watched.
- [ ] **Sidebar**
  - [ ] The website includes a side navigation bar.
  - [ ] The sidebar has three pages:
    - [ ] Home
    - [ ] Favorites
    - [ ] Watched
  - [ ] The Home page displays all current movies in a grid view, the search bar, and the sort movies drop-down.
  - [ ] The Favorites page displays all favorited movies in a grid view.
  - [ ] The Watched page displays all watched movies in a grid view.

### Walkthrough Video

**Walkthrough video:** [Flixster Walkthrough](https://www.loom.com/share/cbe0f5ffef144f31ae44c02395f48857)

### Reflection

* Did the topics discussed in your labs prepare you to complete the assignment? Be specific, which features in your weekly assignment did you feel unprepared to complete?

The labs covered the core React skills this assignment leaned on — component composition, props, `useState`, `useEffect`, and fetching from a REST API — which made the display, search, sort, and pagination features straightforward. I felt less prepared for two things: (1) integrating a third-party AI API (OpenRouter) and designing a good prompt with a graceful fallback, and (2) debugging a browser *rendering* issue — the modal background flickered while the AI recommendation and trailer loaded. That second one turned out to be a CSS compositing problem with `backdrop-filter`, not a React bug, which wasn't something the labs touched on.

* If you had more time, what would you have done differently? Would you have added additional features? Changed the way your project responded to a particular event, etc.

I would finish the **Sidebar** stretch feature — the component is written but not yet wired into the app with Home/Favorites/Watched routing — and **deploy to Render**. I'd also add a small cache so reopening the same movie modal doesn't re-fetch its details, trailer, and AI recommendation every time. On the cleanup side, I already centralized the TMDb config and removed redundant state, but I'd consider memoizing the movie cards so toggling a favorite doesn't re-render the whole grid.

* Reflect on your project demo, what went well? Were there things that maybe didn't go as planned? Did you notice something that your peer did that you would like to try next time?

The core flow demoed well — Now Playing loaded, search and clear behaved, sorting and Load More worked, and the modal showed details with a trailer and an AI recommendation. The part I was most nervous about, the AI call, came through with a solid genre-specific blurb on the movie I picked. What didn't go fully to plan: I hadn't deployed yet, so I demoed locally, and one movie I opened had no trailer — which actually worked out since it showed the graceful "render nothing" fallback rather than breaking. From a peer I liked seeing a Sidebar with real Home/Favorites/Watched routing, which is exactly the stretch feature I scaffolded but didn't wire up — that's the first thing I'd try next.

### Open-source libraries used

- [React](https://react.dev/) — UI library
- [Vite](https://vitejs.dev/) — build tool / dev server
- [The Movie Database (TMDb) API](https://developer.themoviedb.org/) — movie data
- [OpenRouter API](https://openrouter.ai/) — AI watch recommendations
- [Google Fonts](https://fonts.google.com/) — Inter & Poppins typefaces

### Shout out

Give a shout out to somebody from your cohort that especially helped you during your project. This can be a fellow peer, instructor, TA, mentor, etc.

Big shout out to **[name]** — they helped me think through the `backdrop-filter` flicker and talked me out of over-engineering the state, which kept the project clean. Thanks for the patience and the rubber-ducking!
