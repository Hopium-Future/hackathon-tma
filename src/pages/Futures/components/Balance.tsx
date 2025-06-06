import Card from '@/components/common/card';
import Text from '@/components/common/text';
import UserRole from '@/components/common/UserRole';
import N3AddCircleIcon from '@/components/icons/N3AddCircleIcon';
import { formatBalance } from '@/helper';
import Loans from '@/pages/Wallet/components/Loans';
import { ROUTES } from '@/routing/router';
import useUserStore from '@/stores/user.store';
import useWalletStore from '@/stores/wallet.store';
import { DecimalsFuturesType, PairConfig } from '@/type/futures.type';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Link } from 'react-router-dom';

interface BalanceProps {
    decimals: DecimalsFuturesType;
    pairConfig?: PairConfig;
}
const Balance = ({ decimals, pairConfig }: BalanceProps) => {
    const available = useWalletStore((state) => state.available);
    const { user, userInfo } = useUserStore();

    return (
        <Card className="p-3 justify-between text-md">
            <div className="flex items-center space-x-2 max-w-[150px]">
                <LazyLoadImage src={user?.photoUrl || '/images/avatar.png'} alt="" className="min-w-8 w-8 h-8 rounded-full" />
                <div className="flex flex-col gap-1 text-ellipsis overflow-hidden">
                    <Text className="text-md line-clamp-1 break-words">{user?.username || `${user?.firstName} ${user?.lastName}`}</Text>
                    <UserRole isLoading={!userInfo} partnerName={userInfo?.partnerName} partnerType={userInfo?.partnerType} />
                </div>
            </div>
            {/* <div className="h-full w-[0.5px] bg-divider mx-3" /> */}
            <div className="flex flex-col space-y-1 justify-end items-end flex-1 text-sm">
                <div className="flex items-center space-x-1">
                    <span className="text-sub">Avail:</span>
                    <span className="flex break-all text-right">
                        <span className="font-bold">
                            {formatBalance(available, decimals.symbol)} {pairConfig?.quoteAsset}
                        </span>
                    </span>
                    <Link to={ROUTES.DEPOSIT}>
                        <N3AddCircleIcon size={16} />
                    </Link>
                </div>
                <div className="flex items-center">
                    <span className="text-sub">Loans:</span>
                    <div className="min-w-[86px]">
                        <Loans title={false} />
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default Balance;
