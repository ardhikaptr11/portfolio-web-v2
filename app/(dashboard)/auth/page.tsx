import { Metadata } from "next";
import { AuthForm, GuestAuthForm } from "../components/views/Auth/auth-form";

export const metadata: Metadata = {
  title: "Login | Dashboard",
};

const LoginPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { role } = await searchParams;

  return role === "guest" ? <GuestAuthForm /> : <AuthForm />;
};

export default LoginPage;
