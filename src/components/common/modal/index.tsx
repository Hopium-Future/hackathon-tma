import N3CloseIcon from '@/components/icons/N3CloseIcon';
import { cn } from '@/helper';
import * as Dialog from '@radix-ui/react-dialog';
import classNames from 'classnames';
import React, { useEffect, useId } from 'react';
import { useDebounceValue } from 'usehooks-ts';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { ReactNode } from 'react';
import useModalStore from '@/stores/modal.store';
import WebApp from '@twa-dev/sdk';

interface ModalProps {
    children: React.ReactNode;
    visible?: boolean;
    onClose?: () => void;
    className?: string;
    containerClassName?: string;
    headerClassName?: string;
    title?: string | ReactNode;
    closeIcon?: boolean;
    isClose?: boolean;
    id?: string;
    modal?: boolean;
    type?: string;
    headerPrefix?: ReactNode;
    closeIconClassName?: string;
}

const titleStyle = {
    default: 'text-lg',
    asset_list: 'text-base'
};

const closeIconSize = {
    default: ' w-8 h-8 ',
    asset_list: 'w-6 h-6'
};

const Modal = ({
    children,
    visible = false,
    onClose,
    isClose = true,
    className,
    containerClassName,
    title,
    closeIcon = true,
    headerClassName = '',
    id,
    modal,
    type = 'default',
    headerPrefix,
    closeIconClassName
}: ModalProps) => {
    const [_visible, setVisible] = useDebounceValue(visible, 300);
    const modalId = useId();
    const { addModal, removeModal, modalStack } = useModalStore();
    const zIndex = 1000 + modalStack.indexOf(modalId) * 10;
    const insetTop = WebApp.safeAreaInset.top ?? 0;

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(visible);
        }, 500);
        if (visible) {
            (document as any).activeElement?.blur();
            addModal(modalId);
        }
        return () => {
            clearTimeout(timer);
        };
    }, [visible]);

    useEffect(() => {
        if (!_visible) removeModal(modalId);
    }, [_visible]);

    const _onClose = () => {
        if (onClose) onClose();
    };

    return (
        <Dialog.Root open={visible || _visible} onOpenChange={onClose} modal={modal}>
            <Dialog.Portal>
                {visible && <Dialog.Overlay style={{ zIndex: zIndex - 1 }} className={classNames('DialogOverlay')} />}
                <Dialog.Content
                    style={{ zIndex }}
                    onOpenAutoFocus={(e: { preventDefault: VoidFunction }) => e.preventDefault()}
                    autoFocus={false}
                    className={classNames(
                        'DialogContent bottom-0 left-0 w-full overflow-hidden flex items-center justify-center',
                        {
                            pending_content: !visible
                        },
                        className,
                        insetTop > 0 && 'pt-6'
                    )}
                >
                    <Dialog.Title>
                        <VisuallyHidden>Title</VisuallyHidden>
                    </Dialog.Title>
                    <Dialog.Description>
                        <VisuallyHidden>Description</VisuallyHidden>
                    </Dialog.Description>
                    {isClose && <div className="absolute top-2 left-1/2 -translate-x-1/2 h-1 w-12 bg-background-3 rounded-full z-10" />}
                    <div id={id} className={classNames('container rounded-t-[20px] px-4 pb-11', containerClassName)}>
                        {isClose && (
                            <div className={cn('flex items-center justify-between py-6', { 'justify-end': !title }, headerClassName)}>
                                {headerPrefix && headerPrefix}
                                {title && <h1 className={cn('uppercase font-bold', titleStyle?.[type as keyof typeof titleStyle])}>{title}</h1>}
                                {closeIcon && (
                                    <div
                                        onClick={_onClose}
                                        className={classNames(
                                            'p-1 flex items-center justify-center rounded cursor-pointer',
                                            closeIconSize?.[type as keyof typeof closeIconSize],
                                            closeIconClassName
                                        )}
                                    >
                                        <N3CloseIcon />
                                    </div>
                                )}
                            </div>
                        )}
                        {children}
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default Modal;
