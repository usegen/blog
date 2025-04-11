import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { createHead } from "@plaiceholder/next/client";

// Add Font Awesome
const link = document.createElement("link");
link.rel = "stylesheet";
link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css";
document.head.appendChild(link);

createRoot(document.getElementById("root")!).render(<App />);
