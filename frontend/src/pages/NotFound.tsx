import { Link } from "react-router";

const NotFound = () => (
  <div className="flex min-h-screen items-center justify-center bg-black/90">
    <div className="text-center text-white">
      <h1 className="mb-4 text-4xl font-bold">404</h1>
      <p className="mb-4 text-xl">Oops! Page not found</p>
      <Link to="/" className="text-blue-500 underline hover:text-blue-700">
        Return to Home
      </Link>
    </div>
  </div>
);

export default NotFound;
