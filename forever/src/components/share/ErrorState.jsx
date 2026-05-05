import { Link } from "react-router-dom";

const ErrorState = ({
  title = "Something went wrong",
  message,
  actionLabel = "Go back",
  actionTo = "/",
  onAction,
}) => {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm ring-1 ring-black/5 sm:p-8">
        <p className="text-sm font-semibold text-gray-900">{title}</p>
        {message ? (
          <p className="mt-2 text-sm leading-6 text-gray-600">{message}</p>
        ) : null}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {typeof onAction === "function" ? (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
            >
              {actionLabel}
            </button>
          ) : (
            <Link
              to={actionTo}
              className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
            >
              {actionLabel}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
