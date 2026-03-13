import { Toaster as Sonner, toast } from "sonner";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      position="bottom-center"
      theme="dark"
      className="toaster group"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "flex items-center gap-3 w-full rounded-2xl px-6 py-4 font-medium text-sm shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)] min-w-[340px] justify-center bg-card/95 backdrop-blur-xl border border-border/30 text-foreground",
          description: "text-sm opacity-80 text-muted-foreground",
          success:
            "!bg-emerald-500/15 !border-emerald-500/30 !text-emerald-400 !shadow-[0_8px_32px_-8px_rgba(16,185,129,0.25)]",
          error:
            "!bg-red-500/15 !border-red-500/30 !text-red-400 !shadow-[0_8px_32px_-8px_rgba(239,68,68,0.25)]",
          warning:
            "!bg-orange-500/15 !border-orange-500/30 !text-orange-400 !shadow-[0_8px_32px_-8px_rgba(249,115,22,0.25)]",
        },
      }}
      icons={{
        success: <CheckCircle className="w-5 h-5 shrink-0 text-emerald-400" />,
        error: <XCircle className="w-5 h-5 shrink-0 text-red-400" />,
        warning: <AlertTriangle className="w-5 h-5 shrink-0 text-orange-400" />,
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
