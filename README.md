# Noted

Noted is a focused personal notes workspace for capturing ideas, organizing them by category, and quickly finding what matters. Notes are stored locally in the browser, so the app works without an account or a backend service.

## Features

- Create, edit, and delete notes.
- Organize notes into Work, Personal, and Reading categories.
- Mark notes as favorites.
- Search note titles and content.
- Filter notes by category or favorites.
- Toggle between dark and light themes.
- Responsive layout for desktop and mobile screens.
- Local persistence with browser `localStorage`.

## Technologies

- React 19
- Vite
- Tailwind CSS
- Lucide React
- Oxlint

## Prerequisites

- Node.js 18 or newer
- npm 9 or newer

## Installation

1. Clone the repository and move into the project directory:

   ```bash
   git clone <repository-url>
   cd note-Ai
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

## Run locally

Start the Vite development server:

```bash
npm run dev
```

Open the local URL printed in the terminal, usually `http://localhost:5173`.

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

To run the linter:

```bash
npm run lint
```

## Environment variables

Noted does not currently require environment variables. All note and theme data is stored locally in the browser using `localStorage`.
