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
      
    </div>
  );
}
