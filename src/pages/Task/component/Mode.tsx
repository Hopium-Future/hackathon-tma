import React, { memo } from 'react';

type ModeProps = {
    title: string;
    subTitle: string;
    des: string;
    onclick: () => void;
    blur?: boolean;
    buttonTitle?: string;
    icon: React.ReactNode;
};

const Mode: React.FC<ModeProps> = ({ onclick, subTitle, title, blur = false, icon }) => {
    const handleOnClickMode = () => {
        onclick?.();
    };
    return (
        <section className="p-4 border border-solid border-divider shadow-task flex flex-col gap-2 max-w-[50%] relative w-full" onClick={handleOnClickMode}>
            {blur && <div className="size-full absolute bg-background-1 inset-0 opacity-40"></div>}
            <div className="flex items-center justify-between gap-2">
                <div className="flex gap-x-2">
                    {icon}
                    <p className="text-main text-sm font-bold">{title}</p>
                </div>
                <div className="px-[6px] bg-primary-1 text-md uppercase">{subTitle}</div>
            </div>
        </section>
    );
};

export default memo(Mode);