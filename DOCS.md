# Create an angular 16 project with tailwind, angular materials, firebase and mongodb

## Angular
    ```bash
    ng new novel-app
    ```
**Install angular material:**
    ```
    ng add @angular/material
    ```
    Make sure to include and enable animations
## Tailwind
**Install tailwindcss with autoprefixer:**
    ```bash
    npm install -D tailwindcss postcss autoprefixer
    ```
**After installation:**
    - Initialize tailwind:
    ```bash
    npx tailwind init
    ```
    - Add the source paths to the tailwind.config.js
    ```typescript
        /** @type {import('tailwindcss').Config} */
        module.exports = {
        content: [
            "./src/**/*.{html,ts}",
        ],
        theme: {
            extend: {},
        },
        plugins: [],
        }
    ```
    - Add tailwind styles to the src/styles.css:
    ```css
    /* You can add global styles to this file, and also import other style files */
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    html, body { height: 100%; }
    body { margin: 0; font-family: Roboto, "Helvetica Neue", sans-serif; }
    ```
## Firebase
1. Install Firebase and AngularFire:

    ```bash
    npm install firebase @angular/fire@16
    ```
2. Configure Firebase

- **Create a Firebase Project**:
    - Go to the Firebase console (https://console.firebase.google.com/) and create a new project.   
    - In your Firebase project, go to Project Settings > General > Your web app.
    - Click the "Add app" button.
    - Copy the provided JavaScript configuration object.

- **Configure Environment File**:
Create or modify the env.dev.ts file in your project's src/environments folder:

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "<YOUR_API_KEY>",
    authDomain: "<YOUR_AUTH_DOMAIN>",
    projectId: "<YOUR_PROJECT_ID>",
    storageBucket: "<YOUR_STORAGE_BUCKET>",
    messagingSenderId: "<YOUR_MESSAGING_SENDER_ID>",
    appId: "<YOUR_APP_ID>",
    measurementId: "<YOUR_MEASUREMENT_ID>" 
  }
};
```
> Replace the placeholders with the actual values from your Firebase project.
3. Initialize firebase in your project
