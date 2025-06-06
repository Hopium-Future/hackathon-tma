import { cn, isIOS } from '@/helper';
import React, { useState } from 'react';
import { NumberFormatValues, NumericFormat, NumberFormatBaseProps } from 'react-number-format';

interface InputNumberProps extends NumberFormatBaseProps {
    className?: string;
    inputClassName?: string;
    handleChange?: (value: NumberFormatValues) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    renderPrefix?: React.ReactNode;
    renderSuffix?: React.ReactNode;
    decimal?: number;
    value: string | number;
    allowNegative?: boolean;
    error?: boolean;
    helperText?: string;
    helperTextClassName?: string;
    errorTooltip?: boolean;
    allowLeadingZeros?: boolean;
    suffix?: string;
    prefix?: string;
}

const InputNumber = ({
    className,
    inputClassName,
    onFocus,
    onBlur,
    value,
    handleChange,
    renderPrefix,
    renderSuffix,
    decimal = 0,
    error,
    helperText,
    helperTextClassName,
    errorTooltip,
    ...props
}: InputNumberProps) => {
    const [isFocus, setIsFocus] = useState(false);

    const _handleOnFocus = () => {
        if (props.readOnly || props.disabled) return;
        if (isIOS) {
            const root = document.getElementById('root');
            if (root) root.style.top = '-24px';
        }
        setIsFocus(true);
        if (onFocus) onFocus();
    };

    const _handleOnBlur = () => {
        if (props.readOnly || props.disabled) return;
        if (isIOS) {
            const root = document.getElementById('root');
            if (root) root.style.top = '0px';
        }
        setIsFocus(false);
        if (onBlur) onBlur();
    };

    return (
        <div className="flex flex-col w-full relative">
            <div
                className={cn(
                    'py-2 px-3 flex items-center ring-0.5 ring-divider justify-between rounded bg-background-2 w-full overflow-hidden space-x-1',
                    { '!ring-green-1': isFocus, '!ring-red-1': error || errorTooltip, 'text-disable': props.disabled },
                    className
                )}
            >
                {renderPrefix && renderPrefix}
                <NumericFormat
                    {...props}
                    value={value}
                    defaultValue={value}
                    inputMode="decimal"
                    onFocus={_handleOnFocus}
                    onBlur={_handleOnBlur}
                    thousandSeparator
                    allowedDecimalSeparators={[',', '.']}
                    decimalScale={decimal}
                    className={cn('text-main placeholder:text-sub flex-1 bg-transparent focus:outline-none text-right text-md', inputClassName)}
                    onValueChange={(values) => {
                        handleChange && handleChange(values);
                    }}
                    isAllowed={(values) => {
                        const { floatValue } = values;
                        if (!floatValue || !props.max || floatValue <= +props.max) return true;
                        return false;
                    }}
                    onInput={(e: any) => {
                        if (!props.max) return;
                        const inputValue = +e.target.value.replace(/,/g, '');
                        if (inputValue > Number(props.max)) {
                            e.target.value = String(props.max);
                        }
                    }}
                />
                {renderSuffix && renderSuffix}
            </div>
            <div
                className={cn(
                    'text-md transition-all duration-200 max-h-[0px] w-full overflow-hidden',
                    {
                        'mt-1 max-h-4 text-red-1': error && isFocus,
                        'absolute bottom-[calc(100%+12px)] bg-divider max-h-max text-pure-white p-2 rounded-[4px] error_tooltip': errorTooltip && isFocus
                    },
                    helperTextClassName
                )}
            >
                {helperText}
            </div>
        </div>
    );
};

export default InputNumber;
