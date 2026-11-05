import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center p-6 text-center">
      <div>
        <p className="text-8xl font-extrabold text-primary">404</p>
        <h1 className="mt-4 text-2xl font-bold">This page got lost.</h1>
        <Link className="btn btn-primary mt-6" to="/">
          Return home
        </Link>
      </div>
    </div>
  );
}
