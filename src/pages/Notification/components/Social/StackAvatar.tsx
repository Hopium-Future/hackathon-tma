import { LazyLoadImage } from 'react-lazy-load-image-component';

type TProps = {
    avatars: {
        src: string;
        alt: string;
    }[];
    maxVisible?: number;
};

const StackAvatar = ({ avatars, maxVisible = 3 }: TProps) => {
    const remaining = avatars.length - maxVisible;
    return (
        <div className="flex items-center -space-x-3">
            {avatars.slice(0, maxVisible).map((avatar, index) => (
                <div
                    key={index}
                    className="w-10 h-10 rounded-full border border-pure-black overflow-hidden bg-background-3"
                    style={{ zIndex: maxVisible - index }}
                >
                    <LazyLoadImage src={avatar.src} alt={avatar.alt} className="w-8 h-8 object-cover" effect="blur" />
                </div>
            ))}

            {remaining > 0 && (
                <div className="w-10 h-10 flex items-center justify-center bg-background-3 text-sm font-medium text-white  rounded-full border border-pure-black">
                    +{remaining}
                </div>
            )}
        </div>
    );
};

export default StackAvatar;
