import { Toaster as Sonner, toast } from "sonner";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      position="bottom-center"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:rounded-xl group-[.toaster]:px-5 group-[.toaster]:py-3.5 group-[.toaster]:font-semibold group-[.toaster]:text-sm group-[.toaster]:shadow-2xl group-[.toaster]:border-0 group-[.toaster]:min-w-[320px] group-[.toaster]:justify-center",
          description: "group-[.toast]:text-sm group-[.toast]:opacity-90",
          actionButton: "group-[.toast]:bg-white/20 group-[.toast]:text-white",
          cancelButton: "group-[.toast]:bg-white/10 group-[.toast]:text-white/80",
          success:
            "group-[.toaster]:!bg-emerald-500 group-[.toaster]:!text-white",
          error:
            "group-[.toaster]:!bg-red-500 group-[.toaster]:!text-white",
          warning:
            "group-[.toaster]:!bg-orange-500 group-[.toaster]:!text-white",
        },
      }}
      icons={{
        success: <CheckCircle className="w-5 h-5" />,
        error: <XCircle className="w-5 h-5" />,
        warning: <AlertTriangle className="w-5 h-5" />,
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
