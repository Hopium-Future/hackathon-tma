import { SvgIconType } from '@/type/futures.type';

const SearchIcon = ({ color = '#9D9D9D', ...props }: SvgIconType) => {
    return (
        <svg {...props} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="zoom-in">
                <path
                    id="Union"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.00008 1.6665H11.6667V3.33317H5.00008V1.6665ZM3.33341 4.99984L3.33341 3.33317L5.00008 3.33317L5.00008 4.99984L3.33341 4.99984ZM3.33341 11.6665H1.66675V4.99984H3.33341V11.6665ZM5.00008 13.3332L3.33341 13.3332L3.33341 11.6665H5.00008L5.00008 13.3332ZM11.6667 13.3332V14.9998H5.00008V13.3332H11.6667ZM13.3334 11.6665H11.6667V13.3332H13.3334V14.9998H15.0001V16.6665H16.6667V18.3332H18.3334V16.6665H16.6667V14.9998H15.0001V13.3332H13.3334V11.6665ZM13.3334 4.99984H15.0001V11.6665H13.3334V4.99984ZM13.3334 4.99984L13.3334 3.33317L11.6667 3.33317V4.99984L13.3334 4.99984Z"
                    fill={color}
                />
            </g>
        </svg>
    );
};

export default SearchIcon;
