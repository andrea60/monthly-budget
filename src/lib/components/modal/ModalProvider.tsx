import { atom, useAtom } from "jotai";
import { AnimatePresence } from "motion/react";
import { FunctionComponent, useState } from "react";
import { motion } from "motion/react";

type ModalCompleteReason = "cancel" | "completed";

type ModalState = {
  isOpen: true;
  card: boolean;
  props: any;
  content: React.FunctionComponent<any>;
  onComplete: (reason: ModalCompleteReason) => void;
};

const modalAtom = atom<ModalState[]>([]);
export const ModalRenderer = () => {
  const [modalState, setModalState] = useAtom(modalAtom);

  const topModal = modalState[0];
  const isOpen = !!topModal;

  const handleBackdropClick = () => {
    if (!isOpen) return;

    topModal.onComplete("cancel");
    setModalState((c) => c.slice(1));
  };

  console.log("Modal State", modalState);

  return (
    <AnimatePresence>
      {topModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center px-5"
        >
          <div
            className="absolute top-0 left-0 w-full h-full bg-black opacity-25 z-0"
            onClick={handleBackdropClick}
          />

          <AnimatePresence>
            {topModal.card ? (
              <motion.div
                initial={{ translateY: 50 }}
                animate={{ translateY: 0 }}
                exit={{ translateY: 50 }}
                className="card bg-base-200 relative z-10"
              >
                <div className="card-body">
                  <topModal.content {...topModal.props} />
                </div>
              </motion.div>
            ) : (
              <topModal.content {...topModal.props} />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

type OpenModalArgs<TProps> = {
  content: FunctionComponent<TProps>;
  props: TProps;
  card: boolean;
};

export const useModal = () => {
  const [currentModal, setCurrentModal] = useState<ModalState>();
  const [modal, setModal] = useAtom(modalAtom);

  const openModal = async <TProps,>(args: OpenModalArgs<TProps>) => {
    let resolve = (_: ModalCompleteReason) => {};
    const promise = new Promise((r) => (resolve = r));
    const newModal: ModalState = {
      isOpen: true,
      ...args,
      onComplete: resolve,
    };
    setCurrentModal(newModal);
    setModal((c) => [newModal, ...c]);

    await promise;
  };

  const cancelModal = () => {
    if (!currentModal) return;

    currentModal.onComplete("cancel");
    setModal((c) => c.filter((m) => m !== currentModal));
    setCurrentModal(undefined);
  };

  return {
    isOpen: modal.length > 0 && currentModal === modal[0],
    openModal,
    cancelModal,
  };
};
