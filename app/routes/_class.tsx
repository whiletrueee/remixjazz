import { Link, Outlet, useLocation } from "@remix-run/react";

export default function MainClass() {
  const location = useLocation();
  console.log(location);
  return (
    <div className="font-bold flex flex-col gap-3">
      <div className="flex justify-between px-4">
        <Link
          to="/food"
          className={`text-center w-[47%] ${
            location.pathname === "/food"
              ? "bg-slate-900 text-white"
              : "bg-slate-400/30 text-slate-900"
          } text-lg py-1 rounded-lg`}
        >
          Food
        </Link>
        <Link
          to="/people"
          className={`text-center w-[47%] ${
            location.pathname === "/people"
              ? "bg-slate-900 text-white"
              : "bg-slate-400/30 text-slate-900"
          } text-lg py-1 rounded-lg`}
        >
          People
        </Link>
      </div>
      <Outlet />
    </div>
  );
}
