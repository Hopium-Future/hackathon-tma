import styled from 'styled-components';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const OVERLAP_SPACING = '-6px';

const AvatarGroup = styled.div`
    display: flex;
    align-items: center;
`;

const AvatarWrapper = styled.div<{ $index: number }>`
    margin-left: ${({ $index }) => ($index > 0 ? OVERLAP_SPACING : '0')};
    z-index: ${({ $index }) => 10 - $index};
`;

const MoreAvatars = styled.div`
    left: ${({ children }) => (children ? '32px' : '0px')};
    margin-left: ${OVERLAP_SPACING};
`;

const AvatarStack = ({ avatars }: { avatars: string[] }) => {
    const hasExtraAvatars = avatars.length > 3;
    return (
        <AvatarGroup>
            {avatars?.slice(0, 3).map((src, index) => (
                <AvatarWrapper key={index} $index={index}>
                    <LazyLoadImage src={src} className="w-8 h-8 rounded-full" />
                </AvatarWrapper>
            ))}
            {hasExtraAvatars && (
                <MoreAvatars className="bg-background-3 text-md font-medium flex justify-center items-center w-8 h-8 rounded-2xl">
                    +{avatars.length - 3}
                </MoreAvatars>
            )}
        </AvatarGroup>
    );
};

export default AvatarStack;
