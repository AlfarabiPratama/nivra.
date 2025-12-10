import clsx from "clsx";

export const Card = ({
  children,
  variant = "solid",
  className = "",
  hover = false,
  ...props
}) => {
  return (
    <div
      className={clsx(
        "bg-(--card-color) p-4 md:p-6 rounded-subtle",
        variant === "dashed" ? "dashed-border" : "solid-border",
        "border-(--border-color)",
        hover && "transition-all duration-slow hover:border-(--accent)",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
