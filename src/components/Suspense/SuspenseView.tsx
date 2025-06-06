import colors from "@/config/colors";
import { FC, PropsWithChildren, Suspense } from "react";
import TopBarProgress from "react-topbar-progress-indicator";

const SuspenseView: FC<PropsWithChildren> = ({ children }) => {
  TopBarProgress.config({
    barColors: {
      "0": colors.bull,
    },
    barThickness: 1,
    shadowBlur: 5,
  });

  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>;
};

export default SuspenseView;
