import { cn } from "@/lib/utils";

type ContainerProps = React.ComponentProps<"div"> & {
  as?: "div" | "section" | "main" | "header" | "nav" | "footer";
  size?: "7xl" | "4xl" | "2xl" | "full";
  gutter?: boolean;
};

export function Container({ as: Comp = "div", size = "7xl", gutter = true, className, ...props }: ContainerProps) {
  return (
    <Comp
      className={cn(
        "mx-auto w-full",
        gutter && "px-4 sm:px-5 md:px-6 lg:px-8 xl:px-8 2xl:px-12",
        size === "7xl" && "max-w-7xl",
        size === "4xl" && "max-w-4xl",
        size === "2xl" && "max-w-2xl",
        size === "full" && "max-w-none",
        className,
      )}
      {...props}
    />
  );
}
