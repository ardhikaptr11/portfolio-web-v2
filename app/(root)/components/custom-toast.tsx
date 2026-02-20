import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react"; // Loader2 untuk icon loading
import { ExternalToast, toast as sonnerToast } from "sonner";

interface ToastProps {
  id: string | number;
  title: string;
  message?: string;
  type?: "success" | "error" | "warning" | "info" | "loading";
}

const TOAST_CONFIG = {
  success: {
    icon: Icons.circleCheck,
    color: "text-emerald-400",
    border: "border-emerald-500/30",
    glow: "bg-emerald-500",
    shadow: "shadow-emerald-500/20",
  },
  error: {
    icon: Icons.alertCircle,
    color: "text-rose-400",
    border: "border-rose-500/30",
    glow: "bg-rose-500",
    shadow: "shadow-rose-500/20",
  },
  warning: {
    icon: Icons.alertTriangle,
    color: "text-amber-400",
    border: "border-amber-500/30",
    glow: "bg-amber-500",
    shadow: "shadow-amber-500/20",
  },
  info: {
    icon: Info,
    color: "text-ocean-teal",
    border: "border-ocean-teal/30",
    glow: "bg-ocean-teal",
    shadow: "shadow-ocean-teal/20",
  },
  loading: {
    color: "text-ocean-teal",
    border: "border-ocean-teal/20",
    glow: "bg-ocean-teal/50",
    shadow: "shadow-ocean-teal/10",
  },
};

function Toast({ title, message, id, type = "info" }: ToastProps) {
  const config = TOAST_CONFIG[type];
  const Icon = "icon" in config ? config.icon : null;

  return (
    <div
      className={cn(
        "group bg-ocean-surface/90 relative flex w-full min-w-[320px] items-center gap-4 overflow-hidden rounded-xl border p-4 shadow-2xl backdrop-blur-xl md:max-w-sm",
        config.border,
      )}
    >
      <div
        className={cn(
          "absolute top-0 left-0 h-full w-0.75 transition-colors duration-500",
          config.glow,
          config.shadow,
        )}
        style={{
          filter:
            "drop-shadow(0 0 15px color-mix(in oklch, var(--ocean-deep), transparent 50%))",
        }}
      />

      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-lg border bg-white/5 p-2",
          config.border,
          config.color,
        )}
      >
        {Icon ? (
          <Icon className="size-4.5 animate-pulse" />
        ) : (
          <Spinner className="size-4.5" variant="circle" />
        )}
      </div>

      <div
        className={cn(
          "flex flex-1 flex-col gap-0.5 text-left",
          type === "loading" && "pl-2",
        )}
      >
        <h3 className="font-display text-[11px] leading-none font-bold tracking-[0.2em] text-white/90 uppercase">
          {title}
        </h3>
        {message && (
          <p className="font-sans text-[11px] leading-relaxed text-gray-400/80">
            {message}
          </p>
        )}
      </div>

      {type !== "loading" && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => sonnerToast.dismiss(id)}
          className="absolute -top-1 -right-1"
        >
          <Icons.close className={cn("size-3.5", config.color)} />
        </Button>
      )}
    </div>
  );
}

export const toast = {
  success: (title: string, message?: string, options?: ExternalToast) =>
    sonnerToast.custom(
      (id) => <Toast id={id} title={title} message={message} type="success" />,
      options,
    ),

  error: (title: string, message?: string, options?: ExternalToast) =>
    sonnerToast.custom(
      (id) => <Toast id={id} title={title} message={message} type="error" />,
      options,
    ),

  warning: (title: string, message?: string) =>
    sonnerToast.custom((id) => (
      <Toast id={id} title={title} message={message} type="warning" />
    )),

  info: (title: string, message?: string) =>
    sonnerToast.custom((id) => (
      <Toast id={id} title={title} message={message} type="info" />
    )),

  promise: <T,>(
    promise: Promise<T>,
    data: {
      loading: string;
      success: (res: T) => string | { title: string; message?: string };
      error: (err: Error) => string | { title: string; message?: string };
      message?: string;
    } & ExternalToast,
  ) => {
    const {
      loading,
      success,
      error,
      message: defaultMsg,
      ...sonnerOptions
    } = data;

    return sonnerToast.promise(promise, {
      ...sonnerOptions,
      loading: (
        <Toast
          id="loading"
          type="loading"
          title={loading}
          message={defaultMsg}
        />
      ),
      success: (res) => {
        const result = success(res);
        const title = typeof result === "string" ? result : result.title;
        const message =
          typeof result === "string" ? defaultMsg : result.message;

        return (
          <Toast id="success" type="success" title={title} message={message} />
        );
      },
      error: (err) => {
        const result = error(err);
        const title = typeof result === "string" ? result : result.title;
        const message =
          typeof result === "string" ? defaultMsg : result.message;

        return (
          <Toast id="error" type="error" title={title} message={message} />
        );
      },
    });
  },
};
