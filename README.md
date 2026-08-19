# Interactive Comments Section

A fully interactive comments section web application built with **Vanilla JavaScript**, **HTML5**, and **Sass**, featuring dynamic state management, local storage persistence, and component-driven rendering.

---

## Features

* **Dynamic CRUD Operations:** Add new comments, reply to existing threads, edit your own comments, and delete comments with confirmation.
* **Score & Voting System:** Upvote and downvote comments and replies dynamically.
* **Local Storage Integration:** All data (comments, replies, and votes) persists across page refreshes.
* **Interactive State Control:** Built with pure JavaScript functions, utilizing intelligent conditional rendering (distinguishing between the current user and other authors).
* **Responsive Design:** Fully adaptive layout across mobile devices, tablets, and desktops using modern CSS/Sass (Flexbox/Grid and Media Queries).

---

## Built With

* **HTML5** & **Sass (SCSS)** (Variables, nesting, mixins, responsive design)
* **Vanilla JavaScript (ES6+)** (DOM manipulation, Event delegation, Pure render functions)
* **LocalStorage API** for data persistence

---

## What I Learned / Technical Highlights

* Implementing **Component-Driven Architecture** in vanilla JS by separating markup generation into pure template functions (`renderComments`, `renderReplies`).
* Managing precise **DOM Scoping** to handle multiple open comment/reply boxes cleanly without interfering with each other.
* Applying robust **Tag Fallbacks** to gracefully handle legacy or seed data alongside dynamically created user interactions.

---

## Getting Started

To run this project locally, simply clone the repository and open the `index.html` file in your browser:

```bash
git clone [https://github.com/SalmaAbdelrhmanMostafaMahmoud/Interactive-comments-section](https://github.com/SalmaAbdelrhmanMostafaMahmoud/Interactive-comments-section)
cd interactive-comments-section