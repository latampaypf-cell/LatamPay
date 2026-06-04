import { Outlet } from "react-router-dom";
import { PrivateNavbar } from "../components/navbar/PrivateNavbar";

export function PrivateLayout() {
  return (
    <div className="private-layout">
      <header>
        <PrivateNavbar />
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default PrivateLayout;
