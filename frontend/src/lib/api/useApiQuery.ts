import { useCallback, useEffect, useRef, useState } from "react";

export type QueryState<T> =
  | { status: "loading" }
  | { status: "error"; error: Error }
  | { status: "success"; data: T };

/** Minimal data-fetching hook. Swap for a richer library later if needed. */
export function useApiQuery<T>(fetcher: (signal: AbortSignal) => Promise<T>) {
  const [state, setState] = useState<QueryState<T>>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: "loading" });
    fetcherRef
      .current(controller.signal)
      .then((data) => setState({ status: "success", data }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setState({
          status: "error",
          error: error instanceof Error ? error : new Error("Unknown error"),
        });
      });
    return () => controller.abort();
  }, [attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { state, retry };
}
