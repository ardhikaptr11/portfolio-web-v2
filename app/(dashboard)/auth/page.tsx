import { Metadata } from "next";
import AuthForm from "../components/views/Auth/auth-form";

export const metadata: Metadata = {
  title: "Login | Dashboard",
}

const LoginPage = () => {
  return <AuthForm />;
};

export default LoginPage;
