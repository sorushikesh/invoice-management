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

## Backend Integration

- API base URL
  - In development, the Vite dev server proxies `/api` to your backend services.
  - For production, set `VITE_API_URL` to your gateway/base API URL, or serve the UI from the same origin so `/api` works.

- Multi-service dev proxy
  - Define service targets via env in `.env`:
    - `VITE_PROXY_DEFAULT` → maps `/api` to the given target (e.g., `http://localhost:8081/api/v1`).
    - `VITE_PROXY_AUTH` → maps `/api/auth` to the given target.
    - `VITE_PROXY_BILLING` → maps `/api/billing` to the given target.
    - Add more with the `VITE_PROXY_*` pattern; the suffix becomes the path segment under `/api`.
  - The target’s base path (e.g., `/api/v1`) is preserved via rewrite. See `.env.example`.

- Dev server
  - Vite runs on `http://localhost:5173`.
  - Run your services, then `npm run dev`; the UI forwards `/api/...` calls per the proxy mapping.

- Client code
  - Generic API helper in `src/services/api.ts` uses `VITE_API_URL` or the relative `/api` proxy.
  - Example paths: `apiFetch('/auth/login')`, `apiFetch('/auth/users/register')`, `apiFetch('/billing/invoices')`.

- CORS
  - If you don’t use the dev proxy or same origin, enable CORS on your backend for the UI origin.

- Environment
  - Copy `.env.example` to `.env` and tweak as needed.
  - Supabase variables are present but optional.

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
