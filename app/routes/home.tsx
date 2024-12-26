import type { Route } from "./+types/home";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home" },
    { name: "description", content: "Welcome to the Home page!" },
  ];
}

export default function Home() {
  const user = useAuth();

  const handleClick = () => {
    console.log("ok");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <button onClick={handleClick} style={{ padding: "10px 20px", fontSize: "16px" }}>
        Click Me
      </button>
      {user ? (
        <div className="mt-4 text-green-500">User is logged in: {user.email}</div>
      ) : (
        <div className="mt-4 text-red-500">No user is logged in</div>
      )}
    </div>
  );
}
