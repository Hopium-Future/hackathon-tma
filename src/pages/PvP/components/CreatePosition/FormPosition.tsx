import { createPositionApi } from "@/apis/pvp.api";
import Button from "@/components/common/Button";
import FormInputNumber from "@/components/common/input";
import LogoIcon from "@/components/icons/LogoIcon";
import colors from "@/config/colors";
import { cn, formatNumber } from "@/helper";
import { ASSET, SIDE } from "@/helper/constant";
import useUserStore from "@/stores/user.store";
import { FC, useEffect, useMemo, useState } from "react";

type FormPositionProps = {
    getPositions: () => void;
    isMax: boolean;
};

const FormPosition: FC<FormPositionProps> = ({ getPositions, isMax }) => {
    const [width, setWidth] = useState(0);

    useEffect(() => {
        const container = document.getElementById("form-position") as Element;

        if (container) setWidth(container.clientWidth);
    }, []);

    const [side, setSide] = useState(SIDE.PUMP);
    const handleChangeSide = (side: string) => {
        setSide(side);
    };

    const { wallet } = useUserStore();

    const [margin, setMargin] = useState(0);
    const handleOnChange = (value: number) => {
        setMargin(value);
    };

    const min = useMemo(() => 0, []);
    const max = useMemo(() => wallet[ASSET.HOPIUM].available, [wallet]);

    const invalid = useMemo(() => {
        const floor = min < 0 ? 0 : min;
        const ceil = max < 0 ? 0 : max;
        if (margin && (Number(margin) < floor || Number(margin) > ceil)) {
            return "The balance in the wallet is not enough.";
        }

        return "";
    }, [min, max, margin]);

    const isDisable = useMemo(() => margin < 100 || invalid || isMax, [margin, invalid, isMax]);

    const handleCreatePosition = async () => {
        try {
            const res = await createPositionApi({
                target: side.toLowerCase(),
                amount: margin
            });

            if (res.data) {
                getPositions();
            }
        } catch (error) {
            const err = error as Error;
            console.log(`Create position is error: ${err.message}`);
        }
    };

    return (
        <div id="form-position" className="mt-9 bg-background-2 border border-divider p-4 relative">
            {/* tab side */}
            <div className={
                cn("absolute -top-[20px] flex items-center border border-divider", width === 0 && "w-[calc(100vw-64px)] max-w-[326px]")
            } style={{ width: `${width - 32}px` }}>
                <button
                    className={
                        cn(
                            "font-determination !text-determination-lg p-2 w-full max-w-[50%] text-sub bg-background-2",
                            side === SIDE.PUMP && "bg-green-1 text-primary-2"
                        )
                    }
                    onClick={() => handleChangeSide(SIDE.PUMP)}
                >
                    {SIDE.PUMP}
                </button>
                <button
                    className={
                        cn(
                            "font-determination !text-determination-lg p-2 w-full max-w-[50%] text-sub bg-background-2",
                            side === SIDE.DUMP && "bg-red-1 text-main"
                        )
                    }
                    onClick={() => handleChangeSide(SIDE.DUMP)}
                >
                    {SIDE.DUMP}
                </button>
            </div>

            {/* available */}
            <div className="mt-4 flex items-center justify-between">
                <p className="text-base font-bold">Margin</p>
                <div className="flex items-center gap-x-1 text-sm">
                    <p className="text-sub">Available</p>
                    <p className="text-main font-bold">{formatNumber(wallet[ASSET.HOPIUM].available)}</p>
                    <LogoIcon className="size-4 text-pure-white" logoColor={colors.pure.black} />
                </div>
            </div>

            <FormInputNumber
                suffix="Hopium"
                placeholder="Hopium"
                size="lg"
                decimal={5}
                value={margin}
                onChange={(values) => handleOnChange(values.floatValue || 0)}
                suffixClassName="text-sub"
                wrapperClassInput="items-center"
                labelClassName="border-b border-dashed border-typo-secondary"
                errorMessage={invalid}
            />

            <Button variant={isDisable ? "disable" : "primary"} className="mt-4" onClick={handleCreatePosition}>
                <div className={
                    cn("text-base font-bold text-nowrap inline-block",
                        isDisable ? "text-sub" : "text-pure-white"
                    )
                }>
                    {isMax ? "Maximum capacity" : "Accept"}
                </div>
            </Button>
        </div>
    );
};

export default FormPosition;