'use client';

import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { cn } from '@/helper';

const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitives.Root>, React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>>(
    ({ className, ...props }, ref) => (
        <SwitchPrimitives.Root
            className={cn(
                'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-green-2 data-[state=unchecked]:bg-background-3',
                className
            )}
            {...props}
            ref={ref}
        >
            <SwitchPrimitives.Thumb
                className={cn(
                    'pointer-events-none block h-4 w-4 rounded-full data-[state=checked]:bg-green-1 data-[state=unchecked]:bg-sub ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0'
                )}
            />
        </SwitchPrimitives.Root>
    )
);
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
