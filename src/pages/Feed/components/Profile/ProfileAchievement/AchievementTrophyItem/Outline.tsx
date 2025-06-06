interface IProps {
    className?: string;
}

const OutLine = ({ className }: IProps) => {
    return (
        <svg className={className} viewBox="0 0 84 84" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M79.2008 79.2031H76.8008V81.6031H79.2008V79.2031Z" fill="currentColor" />
            <path d="M79.2008 2.39844H76.8008V4.79844H79.2008V2.39844Z" fill="currentColor" />
            <path d="M7.19922 81.6016V84.0016H76.7992V81.6016H7.19922Z" fill="currentColor" />
            <path d="M76.7992 2.4V0H7.19922V2.4H76.7992Z" fill="currentColor" />
            <path d="M4.79844 76.7969H2.39844V79.1969H4.79844V76.7969Z" fill="currentColor" />
            <path d="M7.22031 2.42188H4.82031V4.82188H7.22031V2.42188Z" fill="currentColor" />
            <path d="M7.20078 79.2031H4.80078V81.6031H7.20078V79.2031Z" fill="currentColor" />
            <path d="M79.2016 76.7969H81.6016V79.1969H79.2016V76.7969Z" fill="currentColor" />
            <path d="M4.79844 4.79688H2.39844V7.19688H4.79844V4.79688Z" fill="currentColor" />
            <path d="M79.2016 4.79688H81.6016V7.19688H79.2016V4.79688Z" fill="currentColor" />
            <path d="M2.4 7.20312H0V76.8031H2.4V7.20312Z" fill="currentColor" />
            <path d="M81.6 7.20312H84V76.8031H81.6V7.20312Z" fill="currentColor" />
        </svg>
    );
};

export default OutLine;
