import { useRef, useLayoutEffect, useState, useMemo, useEffect } from "react";
import { useModal } from "./modal/ModalProvider";
import { motion } from "motion/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

type Coords = {
  x: number;
  y: number;
};
const LONG_PRESS_DURATION = 750; // duration in milliseconds
type Props = {
  children: React.ReactElement;
  tooltip: React.ReactElement | string;
  tooltipHeader: string;
};
export const ModalTooltip = ({ children, tooltip, tooltipHeader }: Props) => {
  const { openModal, ...modal } = useModal();

  const [coords, setCoords] = useState<Coords>();
  const [isMoving, setIsMoving] = useState(false);
  const timerRef = useRef<number>(undefined);
  const childRef = useRef<HTMLDivElement>(null);

  const startPressTimer = () => {
    timerRef.current = setTimeout(async () => {
      // Long press event
      if (!childRef.current) return;
      setCoords(undefined);
      openModal({
        content: ModalContent,
        card: false,
        props: {
          subjectRef: childRef,
          applyCoords: setCoords,
          tooltip,
          tooltipHeader,
        },
      });
    }, LONG_PRESS_DURATION);
  };

  const clearPressTimer = () => {
    clearTimeout(timerRef.current);
  };

  const handleMouseDown = () => startPressTimer();
  const handleMouseUp = () => clearPressTimer();
  const handleMouseLeave = () => clearPressTimer();

  const isFocused = modal.isOpen || isMoving;

  return (
    <motion.div
      onTouchStart={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: modal.isOpen ? 1 : 1.2 }}
      layout
      onLayoutAnimationStart={() => setIsMoving(true)}
      onLayoutAnimationComplete={() => setIsMoving(false)}
      ref={childRef}
      style={{
        position: modal.isOpen ? "relative" : "unset",
        zIndex: isFocused ? 99 : "unset",
        left: modal.isOpen ? coords?.x : undefined,
        top: modal.isOpen ? coords?.y : undefined,
      }}
    >
      {children}
    </motion.div>
  );
};

type ModalContentProps = {
  subjectRef: React.RefObject<HTMLElement>;
  applyCoords: (coords: Coords) => void;
  tooltip: React.ReactElement | string;
  tooltipHeader: string;
};
const ModalContent = ({
  subjectRef,
  applyCoords,
  tooltip,
  tooltipHeader,
}: ModalContentProps) => {
  const anchorRef = useRef<HTMLDivElement>(null);

  const positionElement = () => {
    if (!anchorRef.current || !subjectRef.current) return;
    const { x, y } = computeRelativePositions(
      anchorRef.current,
      subjectRef.current
    );
    applyCoords({ x, y });
  };

  useLayoutEffect(() => {
    // this is made asynchronous in order to allow the browser to recompute all flexbox positions before calculating the values
    const timeout = setTimeout(() => positionElement(), 1);
    return () => clearTimeout(timeout);
  }, [subjectRef, anchorRef]);

  const width = subjectRef.current?.offsetWidth ?? 0;
  const height = subjectRef.current?.offsetHeight ?? 0;
  console.log("Anchor size: ", { width, height });
  return (
    <div className="flex flex-col items-center">
      <div ref={anchorRef} style={{ width, height }} className="mb-1" />
      <div className="card bg-base-200 shadow-md">
        <div className="card-body p-5">
          <h1 className="card-title">
            <InformationCircleIcon className="size-6 inline mr-2" />
            {tooltipHeader}
          </h1>
          <div className="text-sm">{tooltip}</div>
        </div>
      </div>
    </div>
  );
};

const computeRelativePositions = (
  anchor: HTMLElement,
  subject: HTMLElement
) => {
  const anchorRect = anchor.getBoundingClientRect();
  const subjectRef = getNaturalPosition(subject);

  console.log("Anchor is at ", { x: anchor.offsetLeft, y: anchor.offsetTop });

  const offsetY = anchorRect.top - subjectRef.top;
  const offsetX = anchorRect.left - subjectRef.left;

  return { y: offsetY, x: offsetX };
};

const getNaturalPosition = (el: HTMLElement) => {
  const offset = getComputedStyle(el);

  const offsetLeft = Number(offset.left.replace("px", ""));
  const offsetTop = Number(offset.top.replace("px", ""));

  return {
    left: el.offsetLeft - (isNaN(offsetLeft) ? 0 : offsetLeft),
    top: el.offsetTop - (isNaN(offsetTop) ? 0 : offsetTop),
  };
};
