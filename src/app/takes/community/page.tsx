import { redirect } from "next/navigation";

// Community takes are now the Hot Takes deck. Keep this path working for old links.
export default function CommunityTakesPage() {
  redirect("/takes");
}
