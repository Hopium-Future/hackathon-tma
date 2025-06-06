import { cn } from '@/helper';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

interface CardIconProps {
    children: React.ReactNode;
    className?: string;
}

interface CardHeaderProps {
    children: React.ReactNode;
    className?: string;
    justify?: 'between' | 'start';
}

interface CardContentProps {
    children: React.ReactNode;
    className?: string;
}

const cardHeaderVariants = {
    between: 'justify-between',
    start: 'justify-start'
};

const Card = ({ children, className = '', ...props }: CardProps) => {
    return (
        <div className={`flex gap-x-2 ${className}`} {...props}>
            {children}
        </div>
    );
};

const CardHeader = ({ children, justify = 'between', className }: CardHeaderProps) => {
    return <section className={cn('flex flex-col gap-y-3 ', cardHeaderVariants?.[justify], className)}>{children}</section>;
};

const CardIcon = ({ children, className = '' }: CardIconProps) => {
    return <section className={cn('w-8 h-8 flex items-center justify-center', className)}>{children}</section>;
};

const CardContent = ({ children, className }: CardContentProps) => {
    return <div className={cn('flex text-md mt-3 gap-x-[6px] flex-wrap', className)}>{children}</div>;
};

export { Card, CardHeader, CardIcon, CardContent };
