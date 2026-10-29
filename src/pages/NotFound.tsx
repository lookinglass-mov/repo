import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="page py-24">
      <h1 className="text-5xl font-extrabold sm:text-7xl">Nothing in the glass here</h1>
      <p className="mt-4 max-w-prose text-xl text-muted">
        This page does not exist, or it has moved.
      </p>
      <Link to="/" className="btn mt-8">Back to the work</Link>
    </div>
  );
}
