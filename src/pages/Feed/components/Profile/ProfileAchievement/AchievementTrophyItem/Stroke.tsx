interface IProps {
    topColor: string;
    bottomColor: string;
    className?: string;
}

const Stroke = ({ topColor, bottomColor, className }: IProps) => {
    return (
        <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M77.2008 74.7969H74.8008V77.1969H77.2008V74.7969Z" fill={topColor} />
            <path d="M79.5992 72.3984H77.1992V74.7984H79.5992V72.3984Z" fill={topColor} />
            <path d="M5.19922 77.2031V79.6031H74.7992V77.2031H5.19922Z" fill={topColor} />
            <path d="M5.20078 74.7969H2.80078V77.1969H5.20078V74.7969Z" fill={topColor} />
            <path d="M2.79844 52H0.398438V74.8H2.79844V52Z" fill={topColor} />
            <path d="M77.2016 48.3984H79.6016V72.3984H77.2016V48.3984Z" fill={topColor} />
            <path d="M35.1992 0.421875V2.82188H74.7992V0.421875H35.1992Z" fill={bottomColor} />
            <path d="M0.398438 52.0031H2.79844V23.2031H0.398438V52.0031Z" fill={bottomColor} />
            <path d="M79.6016 48.3984H77.2016V18.3984H79.6016V48.3984Z" fill={bottomColor} />
            <path d="M77.2008 2.79688H74.8008V5.19688H77.2008V2.79688Z" fill={bottomColor} />
            <path d="M35.668 2.84188V0.421875H10.668V2.84188H35.668Z" fill={bottomColor} />
            <path d="M0.398438 23.2031H2.79844V11.2031H0.398438V23.2031Z" fill={bottomColor} />
            <path d="M79.6016 18.4016H77.2016V7.60156H79.6016V18.4016Z" fill={bottomColor} />
            <path d="M10.8825 0.421875H5.19922V2.84063H10.8825V0.421875Z" fill={bottomColor} />
            <path d="M5.23359 2.82812H2.80078V5.26094H5.23359V2.82812Z" fill={bottomColor} />
            <path d="M2.79844 5.20312H0.398438V11.2031H2.79844V5.20312Z" fill={bottomColor} />
            <path d="M77.2016 5.20312H79.6016V7.60313H77.2016V5.20312Z" fill={bottomColor} />
        </svg>
    );
};

export default Stroke;
