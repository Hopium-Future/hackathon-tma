import getAge from "@/helper/ages";
import useUserStore from "@/stores/user.store";
import WebApp from "@twa-dev/sdk";
import { useMemo } from "react";

const Pioneer = () => {
    const age = useMemo(() => getAge(WebApp.initDataUnsafe.user?.id || 1), []);
    const { user } = useUserStore();
    return (
        <>
            <p className="text-3xl mt-10 font-bold">
                Telegram Pioneer
            </p>
            <p className="mt-3">
                You've joined Telegram
            </p>
            <p className="text-[200px] leading-[264px]">
                {age}
            </p>
            <p className="text-3xl font-bold">
                Years ago
            </p>
            <p className="mt-3 text-center">
                Your account username is @{user?.username}.
            </p>
            <p className="text-center">
                You're in the Top {WebApp.initDataUnsafe.user?.id} Telegaram OG's.
            </p>
            {user?.isPremium && <span className="text-center">You're Telegram Premium user.</span>}
        </>
    );
};

export default Pioneer;