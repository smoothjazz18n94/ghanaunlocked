import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import { LoadingState } from "./LoadingState";

describe("state components", () => {
  it("LoadingState announces loading", () => {
    render(<LoadingState label="Fetching" />);
    expect(screen.getByRole("status")).toHaveTextContent("Fetching");
  });

  it("ErrorState shows the message and calls onRetry", () => {
    const retry = vi.fn();
    render(<ErrorState message="Bad thing" onRetry={retry} />);
    expect(screen.getByRole("alert")).toHaveTextContent("Bad thing");
    fireEvent.click(screen.getByRole("button", { name: /try again/i }));
    expect(retry).toHaveBeenCalledOnce();
  });

  it("ErrorState hides the retry button when there is no handler", () => {
    render(<ErrorState message="x" />);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("EmptyState renders title, message and action", () => {
    render(<EmptyState title="Empty" message="Nothing here" action={<button>Add</button>} />);
    expect(screen.getByText("Empty")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
  });
});
