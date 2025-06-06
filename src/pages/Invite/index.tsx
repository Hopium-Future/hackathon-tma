import Button from "@/components/common/Button";
import ArrowIcon from "@/components/icons/ArrowIcon";
import CheckIcon from "@/components/icons/CheckIcon";
import CopyIcon from "@/components/icons/CopyIcon";
import DoubleCheckIcon from "@/components/icons/DoubleCheckIcon";
import { cn, copyToClipboard, getRefLink, openShareLink } from "@/helper";
import useUserStore from "@/stores/user.store";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const INVITE_BASE_ROUTE = "/invite";
export const INVITE_ROUTE = {
    BASE: INVITE_BASE_ROUTE,
};

const Invite: FC = () => {
    const navigate = useNavigate();
    const { user, isNew } = useUserStore();

    const handleOnIntroduction = () => {
        if (user?._id) {
            shareLink();
        }
    };

    const backward = () => {
        navigate("/profile");
    };

    const [isCopied, setIsCopied] = useState(false);
    const handleCopy = () => {
        if (user) copyToClipboard(getRefLink(user.referralCode));
        setIsCopied(true);

        toast.success(
            <div className="text-sub flex gap-2 items-center bg-primary-2">
                <CheckIcon className="text-primary-1" /> Copied
            </div>,
            {
                autoClose: 1000,
                className: "p-0 border shadow-copy !bg-primary-2 !border-primary-1 !max-w-[calc(100dvw-32px)] mx-auto",
                icon: false,

                hideProgressBar: true,
                closeButton: false,
                onClose: () => setIsCopied(false)
            }
        );
    };

    const shareLink = () => {

        if (!user) return;

        openShareLink(user.referralCode);
    };

    return (
        <div className="bg-background-1 px-4 relative pb-48">
            <section className={
                cn(
                    "flex flex-col items-start justify-start",
                )
            }>
                {
                    isNew ? <button className="flex items-center gap-x-2 mt-6" onClick={backward}>
                        <ArrowIcon className="size-6" />
                        <p className="text-lg font-bold">Back</p>
                    </button> : null
                }

                <p className="font-determination text-determination-4xl mt-3">Invite friends and get <span className="text-primary-1">extra points</span></p>

                <section className="border border-divider shadow-task mt-6 w-full p-4">
                    <ul className="pl-4">
                        <li className="list-square marker:text-primary-1 text-lg font-bold">Refer your friends</li>
                    </ul>
                    <p className="text-sub mt-2">- Earn 500 HOPIUM for each of your one successful invitation.</p>
                    <p className="text-sub">- Your friend gets 500 $HOPIUM too.</p>
                    <p className="text-sub">- Get 1 ticket in “Fortune Box” from each successful referral.</p>
                    <ul className="pl-4 mt-6">
                        <li className="list-square marker:text-primary-1 text-lg font-bold">Get bonus</li>
                    </ul>
                    <p className="text-sub mt-2">- You can receive 20% of your friends' used HOPIUM!</p>
                    <p className="text-sub">- Your friend can get back 15% of their used HOPIUM.</p>
                </section>

                <p className="mt-6 text-sub">You've earned <span className="text-pure-white">500 HOPIUM</span> from your friends</p>
            </section>
            <div className="flex items-center gap-x-2 fixed bottom-28 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-transparent px-4">
                <Button variant="primary" className="text-pure-white whitespace-nowrap font-bold" title="Invite Friends" onClick={handleOnIntroduction}>
                    Invite Friends
                </Button>
                <Button onClick={handleCopy} className="w-full max-w-[44px] flex justify-center items-center duration-200 ease-in-out">
                    {
                        isCopied ? <DoubleCheckIcon className="text-primary-1" /> : <CopyIcon className="text-pure-black" />
                    }
                </Button>
            </div>
        </div>
    );
};

export default Invite;