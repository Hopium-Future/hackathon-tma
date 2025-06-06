import ChervonIcon from '@/components/icons/ChervonIcon';
import React from 'react';

type FeatureProps = {
    title: string;
    onclick: () => void;
    blur?: boolean;
    icon: React.ReactNode;
};

const Feature: React.FC<FeatureProps> = ({ onclick, title, blur = false, icon }) => {
    const handleOnClick = () => {
        onclick?.();
    };
    return (
        <section className="p-4 border border-solid border-divider shadow-task flex flex-col gap-2 max-w-[50%] relative w-full" onClick={handleOnClick}>
            {blur && <div className="size-full absolute bg-background-1 inset-0 opacity-40"></div>}
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center justify-between gap-x-2">
                    {icon}
                    <p className="text-main text-sm font-bold">{title}</p>
                </div>
                <ChervonIcon className="size-4" />
            </div>
        </section>
    );
};

export default Feature;