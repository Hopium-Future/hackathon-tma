import { FC } from "react";

type SpeedOdoProps = {
    value: string;
    duration?: number;
};

const SpeedOdo: FC<SpeedOdoProps> = ({
    value,
    duration = 500,
}) => {

    return (
        <div
            className="text-determination-xl font-determination flex justify-center overflow-hidden h-[18px] leading-[18px]"
        >
            {(value).split("").map((val, idx) => {
                if (val === ".") return ".";
                if (val !== ",") {
                    return (
                        <div
                            key={idx}
                            className="speedo-digits "
                            style={{
                                marginTop: `calc(-${val}em)`,
                                transition: `${duration}ms all`,
                                transitionDelay: `${((value + "").split("").length - idx) * 20}ms`
                            }}
                        >
                            <div className="speedo-digit" data-val="0">
                                0
                            </div>
                            <div className="speedo-digit" data-val="1">
                                1
                            </div>
                            <div className="speedo-digit" data-val="2">
                                2
                            </div>
                            <div className="speedo-digit" data-val="3">
                                3
                            </div>
                            <div className="speedo-digit" data-val="4">
                                4
                            </div>
                            <div className="speedo-digit" data-val="5">
                                5
                            </div>
                            <div className="speedo-digit" data-val="6">
                                6
                            </div>
                            <div className="speedo-digit" data-val="7">
                                7
                            </div>
                            <div className="speedo-digit" data-val="8">
                                8
                            </div>
                            <div className="speedo-digit" data-val="9">
                                9
                            </div>
                        </div>
                    );
                }
                return <div key={idx}>,</div>;
            })}
        </div>
    );
};

export default SpeedOdo;
