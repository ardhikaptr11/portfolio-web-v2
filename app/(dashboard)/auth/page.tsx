import { constructMetadata } from "@/lib/metadata";
import { AuthForm, GuestAuthForm } from "../components/views/Auth/auth-form";

export const metadata = constructMetadata({
  title: "Login",
  pathname: "/auth",
});

const LoginPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { role } = await searchParams;

  return role === "guest" ? <GuestAuthForm /> : <AuthForm />;
};

export default LoginPage;
