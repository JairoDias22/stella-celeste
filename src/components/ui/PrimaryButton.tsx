import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PrimaryButtonProps = React.ComponentProps<typeof Button>;

export default function PrimaryButton({
  className,
  children,
  ...props
}: PrimaryButtonProps) {
  return (
    <Button
      className={cn(
        "rounded-full bg-yellow-500 px-8 py-6 text-black font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:bg-yellow-400",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}