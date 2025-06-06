import Button from '@/components/common/Button';
import CheckIcon from "@/components/icons/CheckIcon";
import CopyIcon from "@/components/icons/CopyIcon";
import DoubleCheckIcon from "@/components/icons/DoubleCheckIcon";
import { copyToClipboard, fallbackCopyTextToClipboard, getRefLink, isBroswer } from "@/helper";
import useUserStore from '@/stores/user.store';
import { useState } from "react";
import { toast } from "react-toastify";

const CopyButton = () => {
    const { user } = useUserStore();
    const [isCopied, setIsCopied] = useState(false);
    const handleCopy = () => {
        if (user) {
            if (isBroswer()) {
                fallbackCopyTextToClipboard(getRefLink(user.referralCode));
            } else {
                copyToClipboard(getRefLink(user.referralCode));
            }
        }
        setIsCopied(true);

        toast.success(
            <div className="text-main flex gap-2 items-center text-md text-nowrap">
                <CheckIcon className="text-green-1 size-4" /> Copy link to invite friends successfully.
            </div>,
            {
                autoClose: 1000,
                className: "p-0 shadow-copy !bg-background-3 !max-w-[calc(100dvw-32px)] mx-auto",
                icon: false,
                hideProgressBar: true,
                closeButton: false,
                onClose: () => setIsCopied(false)
            }
        );
    };

    return (
        <Button
            onClick={handleCopy}
            className="size-[44px] flex-shrink-0 border flex justify-center items-center duration-200 ease-in-out border-green-1 bg-green-2"
        >
            {
                isCopied ? <DoubleCheckIcon className="text-green-1" /> : <CopyIcon className="text-green-1" />
            }
        </Button>
    );
};

export default CopyButton;