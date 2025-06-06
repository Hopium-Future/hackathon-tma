import Slider, { SliderProps } from 'rc-slider';
import React, { memo, useRef } from 'react';
import styled from 'styled-components';
import colors from '@/config/colors';
import { formatNumber } from '@/helper';

interface SliderRangerProps extends SliderProps {
    color?: string;
    colorActive?: string;
    trackStyle?: any;
    isDisableMark?: boolean;
    value: number | number[];
    railStyle?: React.CSSProperties;
    dotStyle?: React.CSSProperties | ((dotValue: number) => React.CSSProperties);
    className?: string;
    activeDotStyle?: React.CSSProperties;
    positionLabel?: 'top' | 'bottom';
    marks: any;
    tooltip?: boolean;
    min?: number;
    max?: number;
    range?: boolean;
}

const SliderWrapper = styled(Slider)<{
    color?: string;
    colorActive?: string;
    isDisableMark?: boolean;
    positionLabel?: string;
    value: number | number[];
    tooltip?: boolean;
    isMobile: boolean;
}>`
    height: ${({ isMobile }) => (isMobile ? '32px' : '40px')} !important;
    padding: 0;
    ${({ positionLabel }) => (positionLabel === 'top' ? { display: 'flex', alignItems: 'end' } : {})}
    .rc-slider-track {
        background-color: ${({ colorActive }) => colorActive} !important;
        height: 4px;
    }
    .rc-slider-handle {
        background: ${({ colorActive }) => colorActive} !important;
        border-color: ${({ colorActive }) => colorActive} !important;
        opacity: 1;
        cursor: pointer !important;
        width: 16px;
        height: 16px;
        border-color: rgb(43, 43, 55);
        border-width: 1px;
        border-radius: 2px;
        transform: translateX(-50%) rotate(45deg) !important;
        top: -1px;
        &:focus-visible {
            box-shadow: none !important;
            border: none;
        }
    }
    .rc-slider-rail {
        background-color: ${({ color }) => color};
        height: 4px;
    }
    .rc-slider-dot {
        transform: translateX(-50%) rotate(45deg) !important;
        cursor: pointer;
    }
    .rc-slider-dot-active {
        background: ${({ colorActive }) => colorActive} !important;
        border: none;
    }
    .rc-slider-handle-dragging.rc-slider-handle-dragging.rc-slider-handle-dragging {
        border-color: none !important;
        box-shadow: none !important;
        z-index: 99;
        ::before {
            display: ${({ tooltip }) => (tooltip ? 'block' : 'none')};
            content: '${({ value }) => formatNumber(value as number, 0)}';
            position: absolute;
            top: -29px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 12px;
            background-color: #fff;
            border-radius: 50%;
            padding: 0 6px;
        }
    }
    .rc-slider-mark-text {
        color: ${() => colors.main} !important;
        font-size: 12px;
    }
    .rc-slider-mark-text-active {
        /* color: ${() => colors.main} !important; */
        /* font-weight: 600; */
    }
    .rc-slider-mark {
        display: ${({ isDisableMark }) => (isDisableMark ? 'none' : 'inline')} !important;
        top: ${({ positionLabel }) => (positionLabel === 'top' ? '-4px' : '20px')};
    }
`;

const SliderRanger = memo(({ isDisableMark = false, value, positionLabel = 'top', onChange, ...props }: SliderRangerProps) => {
    const valueRef = useRef(value);

    const onFocus = () => {
        const dots = Object.keys(props.marks).map(Number);
        const currentValue = valueRef.current as number;
        const closestDot = dots.reduce((prev, curr) => (Math.abs(curr - currentValue) < Math.abs(prev - currentValue) ? curr : prev));
        if (Math.abs(closestDot - currentValue) <= 5) onHandleChange(closestDot);
    };

    const onHandleChange = (e: number | number[]) => {
        valueRef.current = e;
        if (onChange) onChange(e);
    };

    return (
        <div className="px-1">
            <SliderWrapper
                isMobile={true}
                value={value}
                isDisableMark={isDisableMark}
                positionLabel={positionLabel}
                color={colors.divider.DEFAULT}
                colorActive={colors.green[1]}
                dotStyle={{
                    backgroundColor: colors.background[2],
                    borderColor: colors.divider.DEFAULT,
                    borderWidth: 1,
                    borderRadius: 2,
                    width: 10,
                    height: 10
                }}
                onFocus={onFocus}
                onChange={onHandleChange}
                allowCross
                {...props}
            />
        </div>
    );
});

export default SliderRanger;
