import Card from '@/components/common/card';
import Popover from '@/components/common/popover';
import InfoIcon from '@/components/icons/InfoIcon';

const RulesAlerts = () => {
    const conditions = [
        { text: 'Maximum 10 alerts for 1 asset pair.' },
        { text: 'Maximum 50 alerts for all pairs.' },
        { text: 'Each alert is valid for 90 days.' }
    ];
    return (
        <Popover
            trigger={
                <Card className="h-10 min-w-10 relative cursor-pointer">
                    <InfoIcon size={20 as any} className="IconButton absolute-center text-sub" />
                </Card>
            }
            contentClassName="rounded w-max"
            arrow
        >
            <ul className="flex flex-col space-y-3 list-disc pl-4">
                {conditions.map((condition) => (
                    <li key={condition.text} className="text-sub text-md">
                        {condition.text}
                    </li>
                ))}
            </ul>
        </Popover>
    );
};

export default RulesAlerts;
