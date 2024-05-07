'use client';

import React, { PropsWithChildren, ReactNode, createContext, useContext, useState } from 'react';
import { createPortal } from 'react-dom';

type Context = {
    isOpen: boolean;
    openModal: (content: ReactNode, className?: string) => void;
    closeModal: () => void;
};

const ModalContext = createContext({} as Context);

export const ModalProvider = ({ children }: PropsWithChildren) => {

    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState<ReactNode>(null);
    const [className, setClassName] = useState<string>('');

    const openModal: Context['openModal'] = (content, className) => {
        setClassName(className ?? '');
        setContent(content);
        setIsOpen(true);
    };

    const closeModal: Context['closeModal'] = () => {
        setClassName('');
        setContent(null);
        setIsOpen(false);
    };

    return (
        <ModalContext.Provider
            value={{
                isOpen,
                openModal,
                closeModal,
            }}
        >
        { children }
        {isOpen? createPortal(
            <Modal onClose={closeModal} className={className}>
                {content}
            </Modal>,
                document.body
            )
            : null}
        </ModalContext.Provider>
    );
};

export const useModal = () => useContext(ModalContext);

type ModalProps = {
    onClose: () => void;
    className?: string;
    children?: ReactNode;
};

const Modal = ({ onClose, className, children }: ModalProps) => {
    return (
        <div className={className}>
            <div className="modal-overlay" onClick={onClose} />
            <div className="modal-content">{children}</div>
        </div>
    );
};

export default Modal;
