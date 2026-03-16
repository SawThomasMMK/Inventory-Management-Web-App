# Inventory Management Web App — Frontend

Vue 3 + Vite frontend for the Inventory Management system.

## Requirements

- Node.js (see `package.json` engines)
- NPM

## Setup

Install dependencies:

```sh
npm install
```

Install Heroicons (required by `Login.vue` / `Register.vue`):

```sh
npm install @heroicons/vue
npm install chart.js vue-chartjs
```

## Environment variables

Create a `.env` file in the project root and set your backend API base URL:

```sh
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

If you don’t set it, the frontend defaults to `http://127.0.0.1:8000/api/v1`.

## Run the app

Development:

```sh
npm run dev
```

Production build:

```sh
npm run build
```

Preview production build:

```sh
npm run preview
```

## Auth behavior (current)

- **Login**: `POST ${VITE_API_BASE_URL}/auth/login`
- **Register**: `POST ${VITE_API_BASE_URL}/auth/register` (sends `password_confirmation`)
- **Token storage**: saved in `localStorage` under key **`token`**
- **Logout**: best-effort `POST ${VITE_API_BASE_URL}/auth/logout`, then clears `localStorage.token` and navigates to `/login`

## Project structure (high level)

```text
src/
  api/
    apiClient.js
  components/
    Button.vue
    Input.vue
    Modal.vue
    Table.vue
    Navbar.vue
    ConfirmDelete.vue
  layouts/
    ProjectLayout.vue
  pages/
    Login.vue
    Register.vue
    Dashboard.vue
    Products.vue
    Orders.vue
    Customers.vue
    Employees.vue
    ServiceTeams.vue
    History.vue
  constants/
    mockProducts.js
    mockOrders.js
    mockCustomers.js
  router/
    index.js
```
