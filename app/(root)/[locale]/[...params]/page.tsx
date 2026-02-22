import { constructMetadata } from "@/lib/metadata";
import { notFound } from "next/navigation";

export const metadata = constructMetadata({
  title: "404",
  indexable: false,
});

const ErrorPage = () => {
  notFound();
};

export default ErrorPage;
