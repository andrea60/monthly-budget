import {
  useRef,
  cloneElement,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { useModal } from "./modal/ModalProvider";
import { motion } from "motion/react";

type Coords = {
  x: number;
  y: number;
};
const LONG_PRESS_DURATION = 750; // duration in milliseconds
type Props = {
  children: React.ReactElement;
};
export const ModalTooltip = ({ children }: Props) => {
  const { openModal, ...modal } = useModal();

  const [coords, setCoords] = useState<Coords>();
  const timerRef = useRef<number>(undefined);
  const childRef = useRef<HTMLDivElement>(null);

  const startPressTimer = () => {
    timerRef.current = setTimeout(async () => {
      // Long press event
      if (!childRef.current) return;
      openModal({
        content: ModalContent,
        card: false,
        props: { subjectRef: childRef, applyCoords: setCoords },
      });
    }, LONG_PRESS_DURATION);
  };

  const clearPressTimer = () => {
    clearTimeout(timerRef.current);
  };

  const handleMouseDown = () => startPressTimer();
  const handleMouseUp = () => clearPressTimer();
  const handleMouseLeave = () => clearPressTimer();

  return (
    <motion.div
      onTouchStart={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 1.2 }}
      layout
      ref={childRef}
      style={{
        position: modal.isOpen ? "relative" : "unset",
        zIndex: modal.isTransitioning || modal.isOpen ? 99 : "unset",
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
};
const ModalContent = ({ subjectRef, applyCoords }: ModalContentProps) => {
  const anchorRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    console.log({ subjectRef, anchorRef });
    if (!anchorRef.current || !subjectRef.current) return;
    const { x, y } = computeRelativePositions(
      anchorRef.current,
      subjectRef.current
    );
    applyCoords({ x, y });
  }, [subjectRef, anchorRef]);

  const width = subjectRef.current?.offsetWidth ?? 0;
  const height = subjectRef.current?.offsetHeight ?? 0;
  return (
    <div className="flex flex-col items-center">
      <div ref={anchorRef} style={{ width, height }} className="mb-1">
        Anchor
      </div>
      <div className="card bg-base-200 shadow-md">
        <div className="card-body">This is the card body</div>
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

  const offsetY = anchorRect.top - subjectRef.top;
  const offsetX = anchorRect.left - subjectRef.left;

  return { y: offsetY, x: offsetX };
};

const getNaturalPosition = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect();
  const offset = getComputedStyle(el);
  const scaleFix = getPositionAdjustments(el);

  const offsetLeft = Number(offset.left.replace("px", ""));
  const offsetTop = Number(offset.top.replace("px", ""));

  return {
    left: rect.left - (isNaN(offsetLeft) ? 0 : offsetLeft) + scaleFix.x,
    top: rect.top - (isNaN(offsetTop) ? 0 : offsetTop) + scaleFix.y,
  };
};

const getPositionAdjustments = (el: HTMLElement) => {
  const { width: renderingWidth, height: renderingHeight } =
    el.getBoundingClientRect();
  const { offsetWidth: layoutWidth, offsetHeight: layoutHeight } = el;

  const x = (renderingWidth - layoutWidth) / 2;
  const y = (renderingHeight - layoutHeight) / 2;

  return { x, y };
};
