import { EmptyState } from "../components/ui/EmptyState";

export function SearchPage() {
  return (
    <section className="page">
      <h1>Search</h1>
      <EmptyState
        title="Search is coming soon"
        message="You'll be able to describe what you need and find trusted options."
      />
    </section>
  );
}
