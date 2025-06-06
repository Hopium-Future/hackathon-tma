import { LoadingScreen } from "@/components/Loading/LoadingScreen";
import usePvPStore from "@/stores/pvp.store";
import { FC, useEffect } from "react";
import Position from "./Position";

type PositionsProps = {
  type: string;
};

const Positions: FC<PositionsProps> = () => {
  const { positions, getPositions, loading, resetResults } = usePvPStore();

  useEffect(() => {
    getPositions();

    return () => {
      resetResults()
    }
  }, []);

  if (loading) return <div className="h-[600px]"><LoadingScreen /></div>;
  return (
    <div className="mt-1 flex flex-col items-center">
      {
        positions.map((position) => {
          const { target, id, amount, pvpKey, firstName, lastName, createdAt } = position;
          return <Position
            key={id}
            hopium={amount}
            side={target.toUpperCase()}
            title={target.toUpperCase()}
            name={`${firstName} ${lastName}`}
            id={id}
            pvpKey={pvpKey}
            timestamp={createdAt}
          />;
        })
      }
    </div>
  );
};

export default Positions;