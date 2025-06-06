import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn, scrollHorizontal } from '@/helper';
import { ReactNode } from 'react';
import { ListContent, ListTab } from '@/type/tab.type';

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>>(
    ({ className, ...props }, ref) => (
        <TabsPrimitive.List
            ref={ref}
            className={cn('inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground', className)}
            {...props}
        />
    )
);
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Trigger>, React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>>(
    ({ className, ...props }, ref) => (
        <TabsPrimitive.Trigger
            ref={ref}
            className={cn(
                'inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground',
                className
            )}
            {...props}
        />
    )
);
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Content>, React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>>(
    ({ className, ...props }, ref) => (
        <TabsPrimitive.Content
            ref={ref}
            className={cn(
                'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                className
            )}
            {...props}
        />
    )
);
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };

type Props = {
    listTab: ListTab[];
    listContent?: ListContent[];
    defaultValue?: string;
    filterTable?: ReactNode;
    triggerClassName?: string;
    listContentClassName?: string;
    listTabClassName?: string;
    tabsClassName?: string;
    className?: string;
    handleChangeTab?: (value: string) => void;
    forceMount?: boolean | undefined;
    activeClassName?: string;
};

export default function TabCustom({
    listTab,
    listContent,
    filterTable,
    defaultValue,
    triggerClassName,
    listContentClassName,
    listTabClassName,
    tabsClassName,
    className,
    handleChangeTab,
    forceMount,
    activeClassName
}: Props) {
    const [tabs, setTabs] = React.useState(defaultValue);
    const lazyload = React.useRef<{ [key: string]: boolean }>({ [defaultValue || '']: true });
    const refTabs = React.useRef(null);

    React.useEffect(() => {
        if (!defaultValue) return;
        lazyload.current[defaultValue] = true;
        setTabs(defaultValue);
    }, [defaultValue]);

    const handleOnChangeTab = (value: string) => {
        lazyload.current[value] = true;
        setTabs(value);
        handleChangeTab && handleChangeTab(value);
    };

    return (
        <Tabs defaultValue={tabs} value={tabs} onValueChange={handleOnChangeTab} className={cn('h-full', tabsClassName)}>
            <div className={cn('flex flex-col items-start justify-between bg-transparent', className)}>
                <TabsList ref={refTabs} className={cn('w-full justify-start rounded-none p-0 border-divider overflow-auto no-scrollbar', listTabClassName)}>
                    {listTab.map((tab) => (
                        <TabsTrigger
                            className={cn(
                                'text-base mx-5 py-2 h-full flex items-center gap-x-2 border-b-[0.5px] border-solid',
                                {
                                    'text-main font-bold border-main': tabs === tab.value,
                                    'text-disable font-normal border-transparent': tabs !== tab.value,
                                    [`${activeClassName}`]: tabs === tab.value && activeClassName
                                },

                                triggerClassName
                            )}
                            onClick={(e) => {
                                scrollHorizontal(e.target as HTMLElement, refTabs.current);
                            }}
                            value={tab.value}
                            key={tab.value}
                        >
                            {tab.prefix}
                            {tab.title}
                            {tab.suffix}
                        </TabsTrigger>
                    ))}
                </TabsList>
                {filterTable && <div className="pt-2 w-full">{filterTable}</div>}
            </div>
            {listContent && listContent.length > 0
                ? listContent.map((content) => (
                      <TabsContent
                          key={content.value}
                          forceMount={forceMount && lazyload.current[content.value] ? true : undefined}
                          hidden={tabs !== content?.value}
                          value={content.value}
                          className={cn(listContentClassName)}
                      >
                          {content.children}
                      </TabsContent>
                  ))
                : null}
        </Tabs>
    );
}
