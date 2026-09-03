import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SecondaryButtonProps = React.ComponentProps<typeof Button>;

export default function SecondaryButton({
  className,
  children,
  ...props
}: SecondaryButtonProps) {
  return (
    <Button
      variant="outline"
      className={cn(
        "rounded-full border-zinc-700 bg-transparent px-8 py-6 text-white transition-all duration-300 hover:bg-white hover:text-black",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
