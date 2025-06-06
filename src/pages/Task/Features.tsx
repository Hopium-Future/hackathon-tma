import { BASE_PVP_BOT } from '@/config/app.config';
import WebApp from '@twa-dev/sdk';
import { lazy, useCallback } from 'react';

const Mode = lazy(() => import("./component/Mode"));

const BotIcon = lazy(() => import("@/components/icons/BotIcon"));
const PvpIcon = lazy(() => import("@/components/icons/PvpIcon"));
const Features = () => {

    // TODO: auto bot
    // const [bot, setBot] = useState(false);
    const handleToggleBot = useCallback(() => {
        // setBot(!bot);
    }, []);

    const handlePvpBot = useCallback(() => {
        WebApp.openLink(BASE_PVP_BOT as string);
    }, []);

    return (
        <>
            <div className="mt-8 flex items-center gap-3 w-full">
                <Mode
                    title="Auto Bot"
                    subTitle="soon"
                    des="Earn 500 HOPIUM for each of your one successful."
                    blur={true}
                    onclick={handleToggleBot}
                    icon={<BotIcon className="size-4" />}
                />
                <Mode
                    title="PvP Mode"
                    subTitle="new"
                    des="Where legends clash and claim fortunes. $10,000 awaits"
                    blur={false}
                    onclick={handlePvpBot}
                    buttonTitle="Battle now!"
                    icon={<PvpIcon className="size-4" />}
                />
            </div>

            {/* TODO: auto bot */}
            {/* <Drawer isOpen={bot} onClose={handleToggleBot}>
                {bot && <Bot />}
            </Drawer> */}
        </>
    );
};

export default (Features);