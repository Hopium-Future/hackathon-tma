import { memo } from 'react';

const MedalSkeletonList = () => {
    return Array.from({ length: 7 }).map((_, idx) => (
        <tr key={idx}>
            <td>
                <div className="animate-pulse size-6 rounded-full bg-disable/30" />
            </td>
            <td>
                <div className="animate-pulse flex items-center gap-2">
                    <div className="size-6 rounded-full bg-disable/30" />
                    <div className="h-4 w-20 rounded bg-disable/30" />
                </div>
            </td>
            <td>
                <div className="animate-pulse h-4 w-14 rounded bg-disable/30 float-right" />
            </td>
        </tr>
    ));
};

export default memo(MedalSkeletonList);
