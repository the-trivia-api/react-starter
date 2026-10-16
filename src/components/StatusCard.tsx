import { useEffect, useRef } from "react";

type StatusCardProps = {
  title: string;
  message?: string;
  isLoading?: boolean;
  onRetry?: () => void;
  onChangeSettings?: () => void;
};

/** The loading and error screens */
export const StatusCard = ({
  title,
  message,
  isLoading = false,
  onRetry,
  onChangeSettings,
}: StatusCardProps) => {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => headingRef.current?.focus(), []);

  return (
    <section className="card card--status" role={isLoading ? "status" : "alert"}>
      {isLoading && <span className="spinner" aria-hidden />}
      <h2 ref={headingRef} tabIndex={-1} className="card__title">
        {title}
      </h2>
      {message && <p className="card__text">{message}</p>}
      {(onRetry || onChangeSettings) && (
        <div className="actions">
          {onRetry && (
            <button type="button" className="button button--primary" onClick={onRetry}>
              Try again
            </button>
          )}
          {onChangeSettings && (
            <button type="button" className="button" onClick={onChangeSettings}>
              Change settings
            </button>
          )}
        </div>
      )}
    </section>
  );
};
