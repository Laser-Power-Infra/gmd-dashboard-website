"use client";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-1 items-center justify-center py-20">
      <div className="text-center max-w-lg px-6">
        <span className="fas fa-triangle-exclamation text-[40px] text-destructive mb-4 inline-block" />
        <h3 className="text-lg font-semibold text-ink mb-2">
          Failed to load data
        </h3>
        <p className="text-sm text-ink-muted mb-6">{message}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="px-5 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
