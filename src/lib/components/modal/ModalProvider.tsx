import { atom, useAtom } from "jotai";
import { AnimatePresence, AnimationDefinition } from "motion/react";
import { FunctionComponent, useRef, useState } from "react";
import { motion } from "motion/react";
import { match } from "ts-pattern";

const noop = () => undefined;

type ModalCompleteReason = "cancel" | "completed";

type ModalClosedState = {
  isOpen: false;
  isTransitioning: boolean;
};

type ModalOpenState = {
  isOpen: true;
  isTransitioning: boolean;
  card: boolean;
  props: any;
  content: React.FunctionComponent<any>;
  onComplete: (reason: ModalCompleteReason) => void;
};

type ModalState = {} & (ModalClosedState | ModalOpenState);

const modalAtom = atom<ModalState>({ isOpen: false, isTransitioning: false });
export const ModalRenderer = () => {
  const [modalState, setModalState] = useAtom(modalAtom);

  const handleBackdropClick = () => {
    if (!modalState.isOpen) return;

    modalState.onComplete("cancel");
    setModalState({ isOpen: false, isTransitioning: false });
  };

  const handleAnimationComplete = (_: AnimationDefinition) => {};

  const handleAnimationStart = () => {
    setModalState((c) => ({ ...c, isTransitioning: true }));
  };

  return (
    <AnimatePresence>
      {match(modalState)
        .with({ isOpen: false }, () => null)
        .otherwise(({ card, content: ContentComponent, props }) => (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onAnimationComplete={handleAnimationComplete}
            onAnimationStart={handleAnimationStart}
            className="fixed top-0 left-0 w-full h-full flex items-center justify-center"
          >
            <div
              className="absolute top-0 left-0 w-full h-full bg-black opacity-25 z-0"
              onClick={handleBackdropClick}
            />

            <AnimatePresence>
              {card ? (
                <motion.div
                  initial={{ translateY: 50 }}
                  animate={{ translateY: 0 }}
                  exit={{ translateY: 50 }}
                  className="card bg-base-200 relative z-10"
                >
                  <div className="card-body">
                    <ContentComponent {...props} />
                  </div>
                </motion.div>
              ) : (
                <ContentComponent {...props} />
              )}
            </AnimatePresence>
          </motion.div>
        ))}
    </AnimatePresence>
  );
};

type OpenModalArgs<TProps> = {
  content: FunctionComponent<TProps>;
  props: TProps;
  card: boolean;
};

export const useModal = () => {
  const [modal, setModal] = useAtom(modalAtom);
  const openModal = async <TProps,>(args: OpenModalArgs<TProps>) => {
    let resolve = (_: ModalCompleteReason) => {};
    const promise = new Promise((r) => (resolve = r));
    setModal({
      isOpen: true,
      ...args,
      onComplete: resolve,
      isTransitioning: false,
    });

    await promise;
  };

  const cancelModal = () => {
    if (!modal.isOpen) return;

    modal.onComplete("cancel");
    setModal({ isOpen: false, isTransitioning: false });
  };

  const { isOpen, isTransitioning } = modal;
  return { isOpen, isTransitioning, openModal, cancelModal };
};
