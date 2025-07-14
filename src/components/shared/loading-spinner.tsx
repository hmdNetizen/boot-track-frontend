import classNames from "classnames";
import { Loader2 } from "lucide-react";

type LoadingSpinnerProps = {
  className?: string | undefined;
};

export default function LoadingSpinner({ className }: LoadingSpinnerProps) {
  return (
    <div
      className={classNames(
        "min-h-[70vh] flex justify-center items-center",
        className
      )}
    >
      <Loader2 className="animate-spin size-11 dark:text-slate-200" />
    </div>
  );
}
