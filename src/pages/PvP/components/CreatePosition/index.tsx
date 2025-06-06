import { getPvpPositionsApi } from "@/apis/pvp.api";
import useUserStore from "@/stores/user.store";
import { PvpPosition } from "@/type/pvp.type";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import FormPosition from "./FormPosition";
import Position from "./Position";
import { LoadingScreen } from "@/components/Loading/LoadingScreen";

type CreatePositionProps = {
    type: string;
};

const CreatePosition: FC<CreatePositionProps> = () => {
    const { user } = useUserStore();
    const [positions, setPositions] = useState<PvpPosition[]>([]);

    const [loading, setLoading] = useState(false);
    const getPositions = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getPvpPositionsApi(user?._id, "DESC");
            if (res.data) {
                setPositions(res.data);
            }
        } catch (error) {
            const err = error as Error;
            console.error(`Get positions is error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, [user]);

    const isMax = useMemo(() => positions.length === 3, [positions])

    useEffect(() => {
        getPositions();
    }, []);

    return (
        <section className="mt-4">
            <FormPosition getPositions={getPositions} isMax={isMax} />

            <div className="mt-8 min-h-[400px]">
                <div className="text-lg font-bold flex items-center gap-x-1">
                    <p>Open position</p>
                    <p>({positions.length}/3)</p>
                </div>
                {
                    loading ?
                        <div className="h-[585px]"><LoadingScreen /></div> :

                        <div className="flex flex-col mt-3">
                            {
                                positions.map(position => {
                                    const { id, amount, createdAt, target, pvpKey } = position;
                                    return <Position
                                        getPositions={getPositions}
                                        key={id}
                                        hopium={amount}
                                        side={target.toUpperCase()}
                                        title={target.toUpperCase()}
                                        onclick={() => { }}
                                        timestamp={createdAt}
                                        pvpKey={pvpKey}
                                    />;
                                })
                            }
                        </div>
                }
            </div>
        </section>
    );
};

export default CreatePosition;