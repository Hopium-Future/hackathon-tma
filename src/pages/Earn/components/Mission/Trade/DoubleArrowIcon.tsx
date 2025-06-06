import { ArrowFirstIcon, ArrowSecondIcon } from '@/components/icons/DoubleArrowIcon';
import { cn } from '@/helper';
import { FC } from 'react';

type DoubleArrowIconProps = {
    align?: "right" | "left" | "down";
    active?: boolean;
};
const DoubleArrowIcon: FC<DoubleArrowIconProps> = ({ align = "right", active = false }) => {
    return (
        <>
            <div className={
                cn(
                    "flex items-center relative w-3 h-[9.33px] arrow",
                    // align === "right" && "animation-bounce__right",
                    align === "left" && "rotate-180",
                    align === "down" && "rotate-90",
                )
            }>
                <ArrowFirstIcon
                    className={
                        cn(
                            "chervon w-[6.67px] h-[12px]",
                            align === "left" && "!left-[10%]",
                            align === "down" && "!left-[30%] !top-0",
                            active ? "text-green-1" : "text-white",
                            // align === "right" && "animation-bounce__right",
                        )
                    }
                />
                <ArrowSecondIcon
                    className={
                        cn(
                            "chervon w-[5.33px] h-[9.33px]",
                            align === "left" && "!left-[5%]",
                            align === "down" && "!left-[25%] !top-[15%]",
                            active ? "text-green-1" : "text-disable",
                            // align === "right" && "animation-bounce__right",
                        )
                    }
                />
            </div>
        </>
    );
};

export default DoubleArrowIcon;