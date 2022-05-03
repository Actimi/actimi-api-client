# Client API (UI)

This is an example project for demonstrating Actimi API service with a user inteface.

## Configurations

After starting Client API example, configure `baseUrl` in `src/utils/axiosInstance.ts` for the address your Client API is listening.

```ts
export const axiosInstance = axios.create({
  baseURL: "https://localhost:{PORT}",
  withCredentials: true,
});
```

## Starting Development Server


```bash
# With yarn
yarn
yarn start

# With npm
npm install
npm start
```
