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
            "flex items-center gap-3 w-full rounded-xl px-5 py-3.5 font-semibold text-sm shadow-2xl border-0 min-w-[320px] justify-center bg-black text-white",
          description: "text-sm opacity-90 text-white",
          success: "!bg-emerald-500 text-white",
          error: "!bg-red-500 text-white",
          warning: "!bg-orange-500 text-white",
        },
      }}
      icons={{
        success: <CheckCircle className="w-5 h-5 shrink-0 text-white" />,
        error: <XCircle className="w-5 h-5 shrink-0 text-white" />,
        warning: <AlertTriangle className="w-5 h-5 shrink-0 text-white" />,
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
