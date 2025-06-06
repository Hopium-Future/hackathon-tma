import { formatNumber } from '@/helper';
import { useUserWallet } from '@/stores/user.store';

const Avaiable = () => {
    const userWallet = useUserWallet();
    return (
        <>
            <div className="text-center">
                Available
                <span className="text-primary-1 ml-2">HOPIUM</span>
            </div>
            <div className="text-center mt-2 font-determination text-determination-4xl">
                {formatNumber(userWallet.available)}
            </div>
        </>
    );
};

export default (Avaiable);