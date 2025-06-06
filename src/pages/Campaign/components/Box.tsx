import { cn } from '@/helper';
import { FC, PropsWithChildren, useMemo } from 'react';

type BoxProps = {
    className?: string;
    wrapper?: string;
    border?: string;
    bg?: string;
};

const Box: FC<PropsWithChildren & BoxProps> = ({ children, className, border = "green-3" }) => {

    const bgBorerClass = useMemo(() => `bg-${border}`, [border]);

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
                        "size-0.5 absolute top-0 left-0 bg-background-2",
                        "after:absolute after:contents-[''] after:size-[1px] after:bottom-0 after:right-0 after:block after:bg-divider",
                    )
                } />
                <section className={
                    cn(
                        "size-0.5 absolute top-0 right-0 bg-background-2",
                        "after:absolute after:contents-[''] after:size-[1px] after:bottom-0 after:left-0 after:block after:bg-divider",
                    )
                } />
                <section className={
                    cn(
                        "size-0.5 absolute bottom-0 left-0 bg-background-2",
                        "after:absolute after:contents-[''] after:size-[1px] after:top-0 after:right-0 after:block after:bg-divider",
                    )
                } />
                <section className={
                    cn(
                        "size-0.5 absolute bottom-0 right-0 bg-background-2",
                        "after:absolute after:contents-[''] after:size-[1px] after:top-0 after:left-0 after:block after:bg-divider",
                    )
                } />
            </>
            <>
                <section className={
                    cn(
                        "absolute size-[1px] top-1 left-1",
                        bgBorerClass
                    )
                }></section>
                <section className={
                    cn(
                        "absolute size-[1px] top-1 right-1",
                        bgBorerClass
                    )
                }></section>
                <section className={
                    cn(
                        "absolute size-[1px] bottom-1 left-1",
                        bgBorerClass
                    )
                }></section>
                <section className={
                    cn(
                        "absolute size-[1px] bottom-1 right-1",
                        bgBorerClass
                    )
                }></section>
            </>

            <section className={
                cn(
                    "box-border border h-full flex justify-center items-center w-full",
                    "border-divider",
                    "bg-background-1",
                )
            }>
                {children}
            </section>
        </section>
    );
};

export default Box;