import { Link } from "react-router-dom";
import { EmptyState } from "../components/ui/EmptyState";

export function NotFoundPage() {
  return (
    <section className="page">
      <EmptyState
        title="Page not found"
        message="That page doesn't exist."
        action={<Link className="button" to="/">Go to Home</Link>}
      />
    </section>
  );
}
