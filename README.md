# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Spring Boot Integration (UI-only)

- API base URL
  - In development, the Vite dev server proxies `/api` to your Spring Boot app.
  - Configure the proxy target with `VITE_API_PROXY_TARGET` (defaults to `http://localhost:8080`). See `.env.example`.
  - In production, set `VITE_API_URL` to your backend URL, or serve the UI from the same domain so `/api` works.

- Dev server
  - Vite runs on `http://localhost:5173` to avoid clashing with Spring Boot on `8080`.
  - Start Spring Boot on `8080`, then run `npm run dev` and the UI forwards `/api` calls to the backend.

- Client code
  - Generic API helper in `src/services/api.ts` uses `VITE_API_URL` or a relative `/api` path.
  - Auth endpoints are wired in `src/services/auth.ts` (`POST /api/auth/login`, `POST /api/auth/register`). Adjust paths to match your backend.
  - Login/Signup forms call these services and show success/error toasts.

- CORS
  - If you don’t use the dev proxy or serve UI and API from the same origin, enable CORS on Spring Boot for your UI domain.

- Environment
  - Copy `.env.example` to `.env` and tweak as needed.
  - Supabase variables are present but unused when using Spring Boot.

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
