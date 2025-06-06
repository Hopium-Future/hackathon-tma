import Box from '@/components/common/Box';
import { cn } from '@/helper';
import { MISSION_TYPE } from '@/helper/constant';
import Tasks from '../Tasks';
import Daily from './Daily';

const Trade = () => {
    return (
        <>
            <div className="mt-3">
                <Box>
                    <p className="text-sm text-main text-center">
                        Earn <span className="text-md text-green-1 font-bold">1 HOPIUM</span> for each $1 trading volume
                    </p>
                </Box>
            </div>

            <section className="mt-2 w-full">
                <Tasks type={MISSION_TYPE.TRADE2AIRDROP} className="!h-fit" />
            </section>

            <div className="mt-3">
                <Box>
                    <p className="text-sm text-main">
                        MAKE A TRADE EVERYDAY, <span className="text-md text-green-1 font-bold">CLAIM HOPIUM</span> ALONG THE WAY!
                    </p>
                </Box>
            </div>

            <section className={cn('mt-2')}>
                <Daily />
            </section>
        </>
    );
};

export default Trade;
