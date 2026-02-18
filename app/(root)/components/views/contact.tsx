"use client";

import emailjs from "@emailjs/browser";
import { zodResolver } from "@hookform/resolvers/zod";
import { HelpCircle } from "lucide-react";
import { Fragment, useMemo, useRef, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { FormInput } from "@/app/(dashboard)/components/forms/form-input";
import { FormTextarea } from "@/app/(dashboard)/components/forms/form-textarea";
import { environments } from "@/app/environments";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form"; // Wrapper shadcn
import { Spinner } from "@/components/ui/spinner";
import { motion } from "motion/react";
import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha";
import { GIANT_TEXT_VARIANTS } from "../../constants/variants.constants";
import { toast } from "../custom-toast";
import { useLocale, useTranslations } from "next-intl";

const ContactSchema = z.object({
  sender_name: z.string().min(2, "name_min").nonempty("name_required"),
  sender_email: z.email("email_invalid").nonempty("email_required"),
  subject: z.string().min(5, "subject_min").nonempty("subject_required"),
  message: z.string().min(10, "message_min").nonempty("message_required"),
});

type ContactFormValues = z.infer<typeof ContactSchema>;

const Contact = ({
  contact,
}: {
  contact: {
    email: string;
    phone: string;
  };
}) => {
  const t = useTranslations("Contact");
  const locale = useLocale();

  const CONTACT_CARDS = useMemo(
    () => [
      {
        icon: (
          <Icons.mail className="text-muted-foreground/60 dark:text-foreground group-hover:text-muted-foreground size-5" />
        ),
        label: t("cardLabels.label1"),
        value: contact.email,
        href: `mailto:${contact.email}`,
      },
      {
        icon: (
          <Icons.whatsapp className="text-muted-foreground/60 dark:text-foreground group-hover:text-muted-foreground size-5" />
        ),
        label: t("cardLabels.label2"),
        value: `(+62) ${contact.phone?.slice(1)}`,
        href: `https://wa.me/62${contact.phone?.slice(1)}`,
      },
      {
        icon: (
          <Icons.location className="text-muted-foreground/60 dark:text-foreground group-hover:text-muted-foreground size-5" />
        ),
        label: t("cardLabels.label3"),
        value: "Surabaya, Indonesia",
        href: "https://maps.app.goo.gl/GQ15TvZNWu23FM376",
      },
    ],
    [contact.email, contact.phone],
  );

  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [isLoading, startTransition] = useTransition();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      sender_name: "",
      sender_email: "",
      subject: "",
      message: "",
    },
  });

  const sendMessage = async (
    templateParams: ContactFormValues & { "g-recaptcha-response": string },
  ) => {
    await emailjs.send(
      environments.EMAILJS_SERVICE_ID!,
      environments.EMAILJS_TEMPLATE_ID!,
      templateParams,
      environments.EMAILJS_KEY,
    );
  };

  const onSubmit = async (data: ContactFormValues) => {
    const token = recaptchaRef.current?.getValue();

    if (!token) {
      toast.warning(
        t("notifications.warning.title"),
        t("notifications.warning.message"),
      );
      return;
    }

    const templateParams = {
      ...data,
      "g-recaptcha-response": token,
    };

    startTransition(async () => {
      toast.promise(sendMessage(templateParams), {
        loading: t("notifications.loading"),
        success: () => {
          form.reset();
          if (recaptchaRef.current) recaptchaRef.current.reset();

          return {
            title: t("notifications.success.title"),
            message: t("notifications.success.message"),
          };
        },
        error: (_err) => {
          return {
            title: t("notifications.error.title"),
            message: t("notifications.error.message"),
          };
        },
      });
    });
  };

  return (
    <section
      id="contact"
      className="bg-ocean-surface relative flex min-h-screen w-full items-center overflow-hidden px-6 py-24 font-sans"
    >
      {/* AMBIENT LIGHT EFFECT */}
      <div className="bg-ocean-teal/10 pointer-events-none absolute top-[-20%] left-1/2 h-125 w-200 -translate-x-1/2 rounded-full blur-[150px]" />

      {/* GIANT TEXT */}
      <div className="pointer-events-none absolute top-10 left-1/2 z-0 w-full -translate-x-1/2 text-center select-none">
        <motion.h3
          variants={GIANT_TEXT_VARIANTS}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-ocean-teal/10 dark:text-foreground/3 text-[18vw] leading-none font-bold tracking-tighter uppercase"
          style={{
            maskImage:
              "linear-gradient(to bottom, black 30%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 30%, transparent 100%)",
          }}
        >
          {t("title")}
        </motion.h3>
      </div>

      <div className="relative z-10 mx-auto mt-12 grid max-w-6xl grid-cols-1 items-end gap-16 lg:grid-cols-2 lg:gap-24">
        {/* LEFT COLUMN */}
        <div className="space-y-12">
          <div className="space-y-6">
            {/* HEADER BADGE */}
            <div className="group border-ocean-teal/20 dark:bg-ocean-deep/80 shadow-ocean-teal/5 inline-flex items-center gap-2 rounded-full border p-0.5 pr-4 shadow-lg backdrop-blur-lg transition-all">
              <div className="flex size-6.5 items-center justify-center rounded-full bg-[radial-gradient(circle_at_50%_0%,#f0fdfa_0%,#ccf2f4_100%)] shadow-[0_8px_16px_-4px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(255,255,255,0.7)] dark:bg-[radial-gradient(circle_at_50%_0%,#1e3a3a_0%,#0a1a1a_100%)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                <HelpCircle className="dark:text-ocean-teal/70 text-ocean-teal/70 size-3.5" />
              </div>

              <p className="dark:text-ocean-teal/90 text-ocean-teal/70 text-[10px] font-bold">
                {t("title")}
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-ocean-teal text-4xl font-semibold tracking-tight uppercase md:text-6xl dark:text-white">
                {t("subtitle")}
              </h2>
              <p className="max-w-md text-lg leading-relaxed font-light text-gray-400">
                {t("message")}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {CONTACT_CARDS.map((card, index) => (
              <Link
                key={index}
                href={card.href}
                {...(card.label !== "Direct Email" ? { target: "_blank" } : {})}
                {...(card.label !== "Direct Email"
                  ? { rel: "noreferrer noopener" }
                  : {})}
                className="group hover:border-ocean-teal/40 flex items-center justify-between rounded-2xl border border-white/5 bg-white/2 p-4 transition-all duration-300 hover:bg-white/5"
              >
                <div className="flex items-center gap-5">
                  <div className="group-hover:border-ocean-teal/50 flex size-12 items-center justify-center rounded-xl border border-white/5 transition-colors">
                    {card.icon}
                  </div>
                  <div className="text-sm">
                    <p className="group-hover:text-ocean-teal font-medium text-gray-500 transition-colors">
                      {card.label}
                    </p>
                    <p className="text-gray-600">{card.value}</p>
                  </div>
                </div>

                {/* Arrow Icon */}
                <div className="group-hover:bg-ocean-teal group-hover:border-ocean-teal text-muted-foreground flex size-10 -rotate-45 transform items-center justify-center rounded-full border border-white/10 transition-all group-hover:translate-x-1 group-hover:rotate-0 group-hover:text-white">
                  <Icons.arrowRight className="size-5" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="size-full">
          <div className="border-foreground/10 bg-foreground/3 rounded-lg border p-2 shadow-2xl backdrop-blur-lg">
            <Form form={form} onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <FormInput
                  control={form.control}
                  name="sender_name"
                  placeholder={locale === "id" ? "Nama" : "Name"}
                  disabled={isLoading}
                  inputClassName="h-12 border-foreground/5 rounded-sm text-foreground placeholder:text-gray-600 transition-all bg-foreground/1! backdrop-blur-sm focus-visible:outline-none focus-visible:ring-0 focus-visible:border-foreground/5"
                  enableLocalization={true}
                />

                <FormInput
                  control={form.control}
                  name="sender_email"
                  type="email"
                  placeholder="Email"
                  disabled={isLoading}
                  inputClassName="h-12 border-foreground/5 rounded-sm text-foreground placeholder:text-gray-600 transition-all bg-foreground/1! backdrop-blur-sm focus-visible:outline-none focus-visible:ring-0 focus-visible:border-foreground/5"
                  enableLocalization
                />

                <FormInput
                  control={form.control}
                  name="subject"
                  type="text"
                  placeholder={locale === "id" ? "Subyek" : "Subject"}
                  disabled={isLoading}
                  inputClassName="h-12 border-foreground/5 rounded-sm text-foreground placeholder:text-gray-600 transition-all bg-foreground/1! backdrop-blur-sm focus-visible:outline-none focus-visible:ring-0 focus-visible:border-foreground/5"
                  enableLocalization
                />

                <FormTextarea
                  control={form.control}
                  name="message"
                  placeholder={locale === "id" ? "Pesan" : "Message"}
                  disabled={isLoading}
                  config={{
                    rows: 12,
                    resize: "none",
                    showCharCount: false,
                  }}
                  inputClassName="border-foreground/5 rounded-sm text-foreground placeholder:text-gray-600 transition-all bg-foreground/1! backdrop-blur-sm focus-visible:outline-none focus-visible:ring-0 focus-visible:border-foreground/5"
                  enableLocalization
                />

                <div className="flex justify-center">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={environments.RECAPTCHA_SITE_KEY!}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-ocean-teal dark:bg-foreground dark:text-ocean-surface mt-2 inline-flex w-full items-center justify-center gap-1 rounded-sm text-base font-bold text-white"
                >
                  {isLoading ? (
                    <Fragment>
                      <Spinner variant="circle" />
                      <span>Transmitting...</span>
                    </Fragment>
                  ) : (
                    <Fragment>
                      <Icons.rss className="animate-pulse" />
                      <span>Transmit</span>
                    </Fragment>
                  )}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
