import { AuthProvider } from "@/contexts/AuthContext";
import { Outlet } from "react-router-dom";

const Index = () => (
  <AuthProvider>
    <Outlet />
  </AuthProvider>
);

export default Index;
