import Card from '@/components/common/card';
import HotIcon from '@/components/icons/HotIcon';
import colors from '@/config/colors';
import { hexToRgba } from '@/helper';
import { memo, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import TickerField from './TickerField';
import { getTrendingTokens } from '@/apis/futures.api';
import { LoadingScreen } from '@/components/Loading/LoadingScreen';

const HotTokens = () => {
    const [tokens, setTokens] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    const initData = async () => {
        try {
            const data = await getTrendingTokens();
            if (data) setTokens(data);
        } catch (error) {
            console.log('error', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        initData();
    }, []);

    return (
        <Card className="relative h-[30px] pr-0">
            <div className="w-full overflow-hidden flex items-center h-4">
                {loading && <LoadingScreen className="w-5 h-5 absolute left-1/2 -translate-x-1/2" />}
                <div
                    style={{ background: 'linear-gradient(90deg, #100F14 0%, rgba(16, 15, 20, 0.00) 100%)' }}
                    className="absolute left-[30px] top-0 w-[30px] h-full z-10"
                />
                <div className="flex items-center space-x-1 relative">
                    <HotIcon />
                    <ESlider $gap={8}>
                        <div className="slider-track flex items-center">
                            {tokens.map((token, index) => (
                                <Ranking key={token} rank={index + 1} token={`${token}USDT`} />
                            ))}
                            {tokens.map((token, index) => (
                                <Ranking key={`loop_${token}`} rank={index + 1} token={`${token}USDT`} />
                            ))}
                        </div>
                    </ESlider>
                </div>
                <div
                    style={{ background: 'linear-gradient(270deg, #100F14 0%, rgba(16, 15, 20, 0.00) 100%)' }}
                    className="absolute right-0 top-0 w-[30px] h-full z-0 rounded-r"
                />
            </div>
        </Card>
    );
};

const ESlider = styled.div<{ $gap: number }>`
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    width: 100%;
    --gap: ${({ $gap }) => $gap}px;
    .slider-track {
        display: flex;
        box-sizing: border-box;
        animation-delay: 2s !important;
        animation: autoplay 140s linear infinite;
        width: max-content;
        will-change: transform;
        flex: 0 0 auto;
    }
    .slide {
        box-sizing: border-box;
        flex: 0 0 auto;
        min-width: max-content;
        margin-right: var(--gap);
    }

    @keyframes autoplay {
        0% {
            transform: translateX(0);
        }
        100% {
            transform: translateX(-100%);
        }
    }
    /* &:hover .slider-track {
        animation-play-state: paused;
    } */
`;

const Ranking = ({ rank, token }: { rank: number; token: string }) => {
    const color = useMemo(() => {
        switch (rank) {
            case 1:
                return {
                    background: colors.yellow[1],
                    text: colors.yellow[1],
                    rank: colors.yellow[2],
                    opacity: 0.2
                };
            case 2:
                return {
                    background: colors.blue[1],
                    text: colors.blue[1],
                    rank: colors.blue[2],
                    opacity: 0.2
                };
            case 3:
                return {
                    background: colors.divider.DEFAULT,
                    text: colors.white,
                    rank: colors.background[3],
                    opacity: 1
                };
            default:
                return {
                    background: 'transparent',
                    text: colors.white,
                    rank: 'transparent',
                    opacity: 1
                };
        }
    }, [rank]);

    return (
        <Link className="slide h-full" to={`/futures/${token}`}>
            <div className="relative flex items-center h-full">
                <div className="relative w-[15px]">
                    {rank <= 3 && (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="16" viewBox="0 0 15 16" fill="none">
                                <path d="M4 2V0H15V16H4V14H2V12H0V4H2V2H4Z" fill={color.background} fillOpacity={color.opacity} />
                            </svg>
                            <svg
                                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 14 14"
                                fill="none"
                            >
                                <rect width="2" height="6" transform="matrix(-1 0 0 1 14 4)" fill={color.rank} />
                                <rect x="2" y="2" width="2" height="10" fill={color.rank} />
                                <rect width="2" height="10" transform="matrix(-1 0 0 1 12 2)" fill={color.rank} />
                                <rect x="4" width="6" height="14" fill={color.rank} />
                                <rect y="4" width="2" height="6" fill={color.rank} />
                            </svg>
                        </>
                    )}
                    <span
                        style={{ color: color.text, fontSize: rank <= 3 ? 6 : 8 }}
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2  font-bold"
                    >
                        #{rank}
                    </span>
                </div>
                <div
                    style={{ backgroundColor: hexToRgba(color.background, color.opacity) }}
                    className="text-xs font-medium flex items-center space-x-0.5 px-1 h-4"
                >
                    <span>{token.replace('USDT', '')}</span>
                    <TickerField symbol={token} field={'priceChangePercent'} decimal={2} className="!font-medium" />
                </div>
                {rank <= 3 && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="16" viewBox="0 0 15 16" fill="none">
                        <path d="M3.0746 16H0.000192642V12.6572H3.0746V16Z" fill={color.background} fillOpacity={color.opacity} />
                        <rect
                            x="8.37148"
                            y="15.6064"
                            width="2.15172"
                            height="2.55626"
                            transform="rotate(180 8.37148 15.6064)"
                            fill={color.background}
                            fillOpacity={color.opacity}
                        />
                        <path d="M3.0746 9.3125H0.000192642V5.9697H3.0746V9.3125Z" fill={color.background} fillOpacity={color.opacity} />
                        <rect
                            x="5.88664"
                            y="12.6553"
                            width="2.81379"
                            height="3.3428"
                            transform="rotate(180 5.88664 12.6553)"
                            fill={color.background}
                            fillOpacity={color.opacity}
                        />
                        <rect x="11.0172" y="12.0664" width="1.82068" height="2.16299" transform="rotate(180 11.0172 12.0664)" fill={color.rank} />
                        <path d="M3.00015 2.66699H7.05719e-05V0.000247002H3.00015V2.66699Z" fill={color.background} fillOpacity={color.opacity} />
                        <rect
                            x="8.70465"
                            y="9.3125"
                            width="2.81379"
                            height="3.3428"
                            transform="rotate(180 8.70465 9.3125)"
                            fill={color.background}
                            fillOpacity={color.opacity}
                        />
                        <rect
                            x="14.3297"
                            y="8.72266"
                            width="1.82068"
                            height="2.16299"
                            transform="rotate(180 14.3297 8.72266)"
                            fill={color.background}
                            fillOpacity={color.opacity}
                        />
                        <rect x="5.88664" y="5.9707" width="2.81379" height="3.3428" transform="rotate(180 5.88664 5.9707)" fill={color.rank} />
                        <rect x="11.0167" y="5.37891" width="1.82068" height="2.16299" transform="rotate(180 11.0167 5.37891)" fill={color.rank} />
                        <rect
                            x="8.99556"
                            y="2.66699"
                            width="2.66681"
                            height="2.66675"
                            transform="rotate(180 8.99556 2.66699)"
                            fill={color.background}
                            fillOpacity={color.opacity}
                        />
                    </svg>
                )}
            </div>
        </Link>
    );
};

export default memo(HotTokens);
