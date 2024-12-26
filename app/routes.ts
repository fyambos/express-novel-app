import { type RouteConfig, index } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  {
    path: "/login",
    file: "routes/login.tsx"
  },
  {
    path: "/signup",
    file: "routes/signup.tsx"
  },
  {
    path: "/create-story",
    file: "components/storyCreation.tsx"
  }
] satisfies RouteConfig;