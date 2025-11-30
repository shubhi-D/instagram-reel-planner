// frontend/app/page.tsx

import { redirect } from "next/navigation";

export default function Home() {
  // When someone visits "/", immediately send them to the dashboard
  redirect("/dashboard");
}
