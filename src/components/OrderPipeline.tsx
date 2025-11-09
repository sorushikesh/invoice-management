import { Check, Package, Truck, Home } from "lucide-react";
import { cn } from "@/lib/utils";

type OrderStatus = "pending" | "processing" | "shipped" | "delivered";

const steps = [
  { id: "pending", label: "Order Placed", icon: Package },
  { id: "processing", label: "Processing", icon: Package },
  { id: "shipped", label: "Shipped", icon: Truck },
  { id: "delivered", label: "Delivered", icon: Home },
];

export const OrderPipeline = ({ currentStatus }: { currentStatus: OrderStatus }) => {
  const currentIndex = steps.findIndex((step) => step.id === currentStatus);

  return (
    <div className="py-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          const Icon = step.icon;

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "h-12 w-12 rounded-full flex items-center justify-center transition-all",
                    isCompleted
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                    isCurrent && "ring-4 ring-primary/20"
                  )}
                >
                  {isCompleted && index < currentIndex ? (
                    <Check className="h-6 w-6" />
                  ) : (
                    <Icon className="h-6 w-6" />
                  )}
                </div>
                <span
                  className={cn(
                    "mt-2 text-sm font-medium",
                    isCompleted ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 h-1 mx-4 bg-muted relative">
                  <div
                    className={cn(
                      "absolute inset-0 bg-primary transition-all duration-500",
                      isCompleted ? "w-full" : "w-0"
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
