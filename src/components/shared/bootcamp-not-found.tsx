import { Link } from "react-router-dom";

export default function BootcampNotFound() {
  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-200">
        Bootcamp not found
      </h2>
      <Link to="/" className="btn-primary mt-4">
        Back to Dashboard
      </Link>
    </div>
  );
}
