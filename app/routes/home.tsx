import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home" },
    { name: "description", content: "Welcome to the Home page!" },
  ];
}

export default function Home() {
  const handleClick = () => {
    console.log("ok");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <button onClick={handleClick} style={{ padding: "10px 20px", fontSize: "16px" }}>
        Click Me
      </button>
    </div>
  );
}
