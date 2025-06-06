import Button from "@/components/common/Button";
import { cn } from "@/helper";
import { useNavigate } from "react-router-dom";
<p className="font-bold text-2xl text-center">Someone has joined</p>

const Rejected = () => {
    return (
        <div className="text-main flex flex-col justify-center items-center">
            {/* <div className="mt-3 text-base">
                <p>🔥 Choose "Pump" or "Dump"</p>
                <div className="flex flex-col justify-start">
                    <p>- Place a minimum $100 Hopium bet.</p>
                    <p>- Maximum 3 pending bets allowed.</p>
                </div>
                <p>🔥 Wait for your bet to be matched</p>
            </div> */}
        </div>
    );
};

const Insufficient = () => {
    const navigate = useNavigate();
    const backToHome = () => {
        navigate("/home");
    };

    return (
        <div className="text-main flex flex-col justify-center items-center">
            <p className="font-bold text-2xl text-center">Insufficient account balance</p>
            {/* <div className="mt-3 text-base">
                <p>🔥 Choose "Pump" or "Dump"</p>
                <div className="flex flex-col justify-start">
                    <p>- Place a minimum $100 Hopium bet.</p>
                    <p>- Maximum 3 pending bets allowed.</p>
                </div>
                <p>🔥 Wait for your bet to be matched</p>
            </div> */}

            <Button variant={"primary"} className="mt-6" onClick={backToHome}>
                <span className={
                    cn("text-base font-bold text-pure-white",
                    )
                }>
                    Earn Now
                </span>
            </Button>
        </div>
    );
};

export {
    Rejected,
    Insufficient
};