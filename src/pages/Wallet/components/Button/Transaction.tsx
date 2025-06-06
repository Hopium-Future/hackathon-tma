import Button from '@/components/common/Button';
import { cn } from '@/helper';

const SizeProps: Record<ButtonProps['sizeVariant'], string> = {
    medium: 'h-9'
};

const TypeProps: Record<TransactionType, string> = {
    Deposit: 'bg-green-1 text-background-1 font-bold text-md',
    Withdraw: 'border-[0.5px] text-white font-bold text-md border-divider bg-background-2'
};

type TransactionType = 'Deposit' | 'Withdraw';

type ButtonProps = {
    sizeVariant: 'medium';
};

type TransactionButtonProps = {
    children: React.ReactNode;
    size?: ButtonProps['sizeVariant'];
    type: TransactionType;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const TransactionButton: React.FC<TransactionButtonProps> = ({ children, size = 'medium', type, onClick }) => {
    return (
        <Button className={cn(SizeProps[size], TypeProps[type])} onClick={onClick}>
            {children}
        </Button>
    );
};

export default TransactionButton;
