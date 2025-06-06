import React from 'react';
import CloseIcon from '../icons/CloseIcon';
import { cn } from '@/helper';

interface DrawerProps {
    isOpen: boolean;
    onClose: any;
    children: React.ReactNode;
    className?: string;
}

const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, children, className }) => {
    return (
        <div className={`fixed inset-0 z-50 overflow-hidden duration-500 ${isOpen ? 'bg-background-1' : 'bg-transparent pointer-events-none'}`}>
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            ></div>
            <div
                className={`fixed inset-x-0 bottom-0 max-h-full bg-background-2 border-t-4 border-solid border-divider flex transform transition-transform duration-500 ease-in-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
            >
                <div className="w-screen max-h-full shadow-xl p-4">
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-right w-full">
                        <CloseIcon />
                    </button>
                    <div className={cn("mt-2", className)}>{children}</div>
                </div>
            </div>
        </div>
    );
};

export default Drawer;
