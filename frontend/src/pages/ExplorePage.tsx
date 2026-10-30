import { EmptyState } from "../components/ui/EmptyState";

export function ExplorePage() {
  return (
    <section className="page">
      <h1>Explore</h1>
      <EmptyState
        title="Nothing to explore yet"
        message="Categories and nearby places will appear here."
      />
    </section>
  );
}
