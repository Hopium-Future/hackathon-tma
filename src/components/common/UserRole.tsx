import { memo } from 'react';
import { PARTNER_TYPE } from '@/helper/constant';
import LoadingIcon from '../icons/LoadingIcon';
import styled, { css } from 'styled-components';
import { cn } from '@/helper';

const UserRole = ({ partnerName = 'Newbie', partnerType = PARTNER_TYPE.NEWBIE, isLoading = false, className = '' }) => {
    const getClassNames = (partnerType: number) => {
        const baseClassNames = 'text-xs font-medium py-0.5 px-[6px] rounded-[2px] w-fit border-0.5';
        const typeClassNames = {
            [PARTNER_TYPE.NEWBIE]: ' bg-background-3 border-divider text-sub',
            [PARTNER_TYPE.ROOKIE]: ' bg-[#101C1E] border-[#36A3B9] text-[#36A3B9]',
            [PARTNER_TYPE.DEGEN]: ' bg-green-2 border-green-1 text-green-1',
            [PARTNER_TYPE.PRO]: ' bg-[#231327] border-[#BF7FFF] text-[#BF7FFF]',
            [PARTNER_TYPE.ELITE]: ' bg-[#1E1410] border-[#E5A607] text-[#E5A607]',
            [PARTNER_TYPE.LEGEND]: ' bg-[#1E1010] border-[#FF2B00] text-[#FF2B00]'
        };
        return baseClassNames + (typeClassNames[partnerType] || '');
    };

    return isLoading ? (
        <LoadingIcon className="size-[15px]" />
    ) : (
        <Background $type={partnerType} className={cn(getClassNames(partnerType), className)}>
            {partnerType === PARTNER_TYPE.AMBASSADOR && <Ambassador />}
            <div className="label">{partnerName}</div>
        </Background>
    );
};

const Background = styled.div<{ $type: any }>`
    position: relative;
    ${({ $type }) =>
        $type === PARTNER_TYPE.AMBASSADOR &&
        css`
            border: none;
            svg {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                width: 76px;
                height: 30px;
            }
            .label {
                background: linear-gradient(96deg, #ffd096 -13.44%, #fff5e0 44.25%, #e3a455 141.67%);
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        `}
`;

const Ambassador = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="76" height="30" viewBox="0 0 76 30" fill="none">
        <g filter="url(#filter0_d_4689_46548)">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10 8H66V9H10V8ZM9 10V9H10V10H9ZM9 20H8V10H9V20ZM10 21V20H9V21H10ZM66 21V22H10V21H66ZM67 20V21H66V20H67ZM67 10H68V20H67V10ZM67 10V9H66V10H67ZM11 11H12V12H11V11ZM65 11H64V12H65V11ZM12 18H11V19H12V18ZM64 18H65V19H64V18Z"
                fill="url(#paint0_linear_4689_46548)"
            />
        </g>
        <defs>
            <filter id="filter0_d_4689_46548" x="0" y="0" width="76" height="30" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset />
                <feGaussianBlur stdDeviation="4" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.955755 0 0 0 0 0.889388 0 0 0 0.8 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4689_46548" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_4689_46548" result="shape" />
            </filter>
            <linearGradient id="paint0_linear_4689_46548" x1="2.5" y1="8.43654e-07" x2="83" y2="38.5" gradientUnits="userSpaceOnUse">
                <stop offset="0.0377431" stopColor="#E3A455" />
                <stop offset="0.195396" stopColor="#FFF0D3" />
                <stop offset="0.661171" stopColor="#E3A455" />
                <stop offset="0.909189" stopColor="#FFF0D3" />
            </linearGradient>
        </defs>
    </svg>
);
export default memo(UserRole);
