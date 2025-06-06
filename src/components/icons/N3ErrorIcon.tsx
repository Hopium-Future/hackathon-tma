import { SvgIconType } from '@/type/futures.type';

const N3ErrorIcon = (props: SvgIconType) => {
    const size = props.width || 80;
    return (
        <svg style={{ minWidth: size }} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 80 80" fill="none">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M23.3333 10H56.6667V16.6667H23.3333V10ZM16.6667 23.3333L16.6667 16.6667H23.3333V23.3333L16.6667 23.3333ZM16.6667 56.6667H10V23.3333H16.6667V56.6667ZM23.3333 63.3333H16.6667L16.6667 56.6667L23.3333 56.6667V63.3333ZM56.6667 63.3333V70H23.3333V63.3333H56.6667ZM63.3333 56.6667V63.3333H56.6667L56.6667 56.6667L63.3333 56.6667ZM63.3333 23.3333H70V56.6667H63.3333V23.3333ZM63.3333 23.3333V16.6667H56.6667L56.6667 23.3333L63.3333 23.3333ZM36.6667 30H30V36.6667H36.6667V43.3333H30V50H36.6667V43.3333H43.3333V50H50V43.3333H43.3333V36.6667H50V30H43.3333V36.6667L36.6667 36.6667V30Z"
                fill="#FF2B42"
            />
        </svg>
    );
};

export default N3ErrorIcon;
