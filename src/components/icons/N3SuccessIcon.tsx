import { SvgIconType } from '@/type/futures.type';

const N3SuccessIcon = (props: SvgIconType) => {
    const size = props.width || 80;
    return (
        <svg style={{ minWidth: size }} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 80 80" fill="none">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M56.6667 10H23.3333V16.6667H16.6667V23.3333H10V56.6667H16.6667V63.3333H23.3333V70H56.6667V63.3333H63.3333V56.6667H70V23.3333H63.3333V16.6667H56.6667V10ZM56.6667 16.6667L56.6667 23.3333H63.3333V56.6667L56.6667 56.6667L56.6667 63.3333H23.3333V56.6667L16.6667 56.6667V23.3333H23.3333V16.6667H56.6667ZM26.6675 36.6667H33.3342V43.3333L40 43.3333V50H33.3333V43.3333L26.6675 43.3333V36.6667ZM53.3341 30H46.6675V36.6667H40.0008V43.3333H46.6675V36.6667H53.3341V30Z"
                fill="#3BD975"
            />
        </svg>
    );
};

export default N3SuccessIcon;
