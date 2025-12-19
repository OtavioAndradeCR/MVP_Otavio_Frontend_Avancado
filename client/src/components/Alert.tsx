import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";
import { Alert as AlertUI, AlertDescription, AlertTitle } from "@/components/ui/alert";

export type AlertType = "success" | "error" | "warning" | "info";

interface AlertProps {
  type: AlertType;
  title?: string;
  message: string;
  onClose?: () => void;
}

/**
 * Componente reutilizável de alerta
 * Suporta diferentes tipos: success, error, warning, info
 */
export function Alert({ type, title, message, onClose }: AlertProps) {
  const config = {
    success: {
      icon: CheckCircle,
      className: "border-green-200 bg-green-50",
      titleColor: "text-green-900",
      descColor: "text-green-800",
    },
    error: {
      icon: AlertCircle,
      className: "border-red-200 bg-red-50",
      titleColor: "text-red-900",
      descColor: "text-red-800",
    },
    warning: {
      icon: AlertTriangle,
      className: "border-yellow-200 bg-yellow-50",
      titleColor: "text-yellow-900",
      descColor: "text-yellow-800",
    },
    info: {
      icon: Info,
      className: "border-blue-200 bg-blue-50",
      titleColor: "text-blue-900",
      descColor: "text-blue-800",
    },
  };

  const { icon: Icon, className, titleColor, descColor } = config[type];

  return (
    <AlertUI className={className}>
      <Icon className="h-4 w-4" />
      {title && <AlertTitle className={titleColor}>{title}</AlertTitle>}
      <AlertDescription className={descColor}>{message}</AlertDescription>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          aria-label="Fechar alerta"
        >
          ✕
        </button>
      )}
    </AlertUI>
  );
}
