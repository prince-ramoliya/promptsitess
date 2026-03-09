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
            "flex items-center gap-3 w-full rounded-xl px-5 py-3.5 font-semibold text-sm shadow-2xl border-0 min-w-[320px] justify-center text-white",
          description: "text-sm opacity-90",
          actionButton: "bg-white/20 text-white",
          cancelButton: "bg-white/10 text-white/80",
          success: "!bg-emerald-500 !text-white",
          error: "!bg-red-500 !text-white",
          warning: "!bg-orange-500 !text-white",
        },
      }}
      icons={{
        success: <CheckCircle className="w-5 h-5 shrink-0" />,
        error: <XCircle className="w-5 h-5 shrink-0" />,
        warning: <AlertTriangle className="w-5 h-5 shrink-0" />,
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
