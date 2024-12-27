Create an angular project with tailwind, angular materials, firebase and mongodb

Create a new Angular project using the Angular CLI:
    ```bash
    ng new novel-app
    ```
Install angular material:
    ```
    ng add @angular/material
    ```
    Make sure to include and enable animations
Install tailwindcss with autoprefixer
    ```bash
    npm install -D tailwindcss postcss autoprefixer
    ```
After installation:
do npx tailwind init
Add source path to the tailwind.config.js
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

