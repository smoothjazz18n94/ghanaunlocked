import { EmptyState } from "../components/ui/EmptyState";

export function SavedPage() {
  return (
    <section className="page">
      <h1>Saved</h1>
      <EmptyState
        title="No saved places"
        message="Places you save will show up here."
      />
    </section>
  );
}
