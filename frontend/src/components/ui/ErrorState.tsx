interface Props {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ title = "Something went wrong", message, onRetry }: Props) {
  return (
    <div className="state state--error" role="alert">
      <h2 className="state__title">{title}</h2>
      <p className="state__text">{message}</p>
      {onRetry && (
        <button type="button" className="button" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
