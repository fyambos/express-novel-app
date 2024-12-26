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
    file: "routes/story/story-creation.tsx"
  },
  {
    path: "/stories/:storyId", 
    file: "routes/story/story-details.tsx" 
  }
] satisfies RouteConfig;