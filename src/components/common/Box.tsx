import { cn } from '@/helper';
import { BOX_STATUS } from '@/helper/constant';
import { FC, PropsWithChildren, useMemo } from 'react';

type BoxProps = {
    className?: string;
    classContent?: string;
    wrapper?: string;
    border?: string;
    bg?: string;
    type?: string;
};

const Box: FC<PropsWithChildren & BoxProps> = ({ children, wrapper = "pure-black", className, type = BOX_STATUS.IN_PROGRESS, classContent = "justify-center" }) => {
    const bgWrapper = useMemo(() => `bg-${wrapper}`, [wrapper]);

    const afterBg = useMemo(() => {
        switch (type) {
            case BOX_STATUS.IN_PROGRESS:
                return "after:bg-green-3";

            case BOX_STATUS.UPCOMING:
                return "after:bg-yellow-4";

            case BOX_STATUS.ENDED:
                return "after:bg-red-4";

            default:
                return "after:bg-green-1";
        }
    }, [type]);

    const bg = useMemo(() => {
        switch (type) {
            case BOX_STATUS.IN_PROGRESS:
                return "bg-green-3";

            case BOX_STATUS.UPCOMING:
                return "bg-yellow-4";

            case BOX_STATUS.ENDED:
                return "bg-red-4";

            default:
                return "bg-green-1";
        }
    }, [type]);

    const border = useMemo(() => {
        switch (type) {
            case BOX_STATUS.IN_PROGRESS:
                return "border-green-3";

            case BOX_STATUS.UPCOMING:
                return "border-yellow-4";

            case BOX_STATUS.ENDED:
                return "border-red-4";

            default:
                return "border-green-1";
        }
    }, [type]);

    const bgBox = useMemo(() => {
        switch (type) {
            case BOX_STATUS.IN_PROGRESS:
                return "bg-green-5";

            case BOX_STATUS.UPCOMING:
                return "bg-yellow-5";

            case BOX_STATUS.ENDED:
                return "bg-red-2";

            default:
                return "bg-green-1";
        }
    }, [type]);



    return (
        <section className={
            cn(
                "h-8 relative",
                className
            )
        }>
            {/* border pixel */}
            <>
                <section className={
                    cn(
                        `size-0.5 absolute top-0 left-0`,
                        bgWrapper,
                        "after:absolute after:contents-[''] after:size-[1px] after:bottom-0 after:right-0 after:block",
                        afterBg
                    )
                } />
                <section className={
                    cn(
                        `size-0.5 absolute top-0 right-0`,
                        bgWrapper,
                        `after:absolute after:contents-[''] after:size-[1px] after:bottom-0 after:left-0 after:block`,
                        afterBg
                    )
                } />
                <section className={
                    cn(
                        `size-0.5 absolute bottom-0 left-0`,
                        bgWrapper,
                        `after:absolute after:contents-[''] after:size-[1px] after:top-0 after:right-0 after:block`,
                        afterBg
                    )
                } />
                <section className={
                    cn(
                        `size-0.5 absolute bottom-0 right-0`,
                        bgWrapper,
                        `after:absolute after:contents-[''] after:size-[1px] after:top-0 after:left-0 after:block`,
                        afterBg
                    )
                } />
            </>
            <>
                <section className={
                    cn(
                        "absolute size-[1px] top-1 left-1",
                        bg
                    )
                }></section>
                <section className={
                    cn(
                        "absolute size-[1px] top-1 right-1",
                        bg
                    )
                }></section>
                <section className={
                    cn(
                        "absolute size-[1px] bottom-1 left-1",
                        bg
                    )
                }></section>
                <section className={
                    cn(
                        "absolute size-[1px] bottom-1 right-1",
                        bg
                    )
                }></section>
            </>

            <section className={
                cn(
                    "box-border border h-full flex items-center w-full",
                    border,
                    bgBox,
                    classContent
                )
            }>
                {children}
            </section>
        </section>
    );
};

export default Box;