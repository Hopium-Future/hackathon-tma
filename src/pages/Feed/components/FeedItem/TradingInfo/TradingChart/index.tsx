import { memo } from 'react';
import { useInView } from 'react-intersection-observer';

import TradingChartHeader, { ITradingChartHeaderProps } from './TradingChartHeader';
import TradingChartContainer from './TradingChartContainer';
import { LoadingScreen } from '@/components/Loading/LoadingScreen';

interface ITradingChartProps extends ITradingChartHeaderProps {}

const TradingChart = ({ decimals, post, pairConfig }: ITradingChartProps) => {
    const { ref, inView } = useInView({
        threshold: 1,
        delay: 1000
    });

    return (
        <div ref={ref} className="rounded-xl border border-divider bg-background-4">
            <TradingChartHeader post={post} decimals={decimals} pairConfig={pairConfig} />
            <div className="px-2">
                {post.caption && <p className="text-md text-pure-white font-normal h-8 line-clamp-2 italic">{post.caption}</p>}
                <div className="h-[114px]">{inView ? <TradingChartContainer post={post} /> : <LoadingScreen />}</div>
            </div>
        </div>
    );
};

export default memo(TradingChart);
