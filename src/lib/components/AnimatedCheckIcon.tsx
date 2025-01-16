import styles from "./AnimatedCheckIcon.module.css";
import cn from "classnames";
type Props = {
  className?: string;
};
export const AnimatedCheckIcon = ({ className }: Props) => {
  return (
    <svg
      className={className}
      viewBox="0 0 133 133"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <g
        className={styles.checkGroup}
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <circle className="fill-success" cx="66.5" cy="66.5" r="54.5" />
        <circle
          className={cn(styles.outline, "fill-success-secondary")}
          strokeWidth="4"
          cx="66.5"
          cy="66.5"
          r="54.5"
        />
        <circle
          className={cn(styles.whiteCircle, "fill-success")}
          cx="66.5"
          cy="66.5"
          r="55.5"
        />

        <polyline
          className={cn(styles.check, "stroke-success")}
          strokeWidth="5.5"
          points="41 70 56 85 92 49"
        />
      </g>
    </svg>
  );
};
