import { Outlet } from "react-router-dom";
import Navbar from "@/components/organisms/Navbar";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}
