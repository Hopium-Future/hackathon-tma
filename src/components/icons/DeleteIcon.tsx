import { SvgIconType } from '@/type/futures.type';

const DeleteIcon = (props: SvgIconType) => {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.66406 1.33398H9.33073V2.66732H6.66406V1.33398ZM13.3333 4H14.6654V5.33333H13.3333V13.3333H12V5.33333H10.6654V5.33464H9.33203V5.33333H6.66536V5.33464H5.33203V5.33333H1.33203V4H5.33203V2.66797H6.66536V4H9.33203V2.66797H10.6654V4H12H13.3333ZM12 13.334H4V14.6673H12V13.334ZM2.66406 5.33398H3.9974V13.334H2.66406V5.33398ZM6 6.66797H7.33333V12.0013H6V6.66797ZM9.9974 12.0013V6.66797H8.66406V12.0013H9.9974Z"
                fill="#9D9D9D"
            />
        </svg>
    );
};

export default DeleteIcon;
