import { cn } from '@/helper';

const Skeleton = ({ className, children, loading, ...props }: React.HTMLAttributes<HTMLDivElement> & { loading?: boolean }) => {
    if (children) {
        if (!loading) return <div className={className}>{children}</div>;
        return (
            <div className={cn('animate-pulse rounded bg-grey-1 relative', className)} {...props}>
                <div className="bg-grey-1 absolute inset-0 z-10 rounded" />
                {children}
            </div>
        );
    }

    return <div className={cn('animate-pulse rounded bg-grey-1', className)} {...props} />;
};

export default Skeleton;
