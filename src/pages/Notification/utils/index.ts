import dayjs from 'dayjs';

export const shortenHash = (hash: string, length: number = 4) => {
    if (typeof hash !== 'string') {
        return String(hash);
    }

    if (hash.length <= length * 2) return hash;
    return `${hash.slice(0, length)}...${hash.slice(-length)}`;
};

function getTimeDiff(dateString: string): string {
    const now = dayjs();
    const past = dayjs(dateString);
    const diffInSeconds = now.diff(past, 'second');

    if (diffInSeconds < 60) return '<1m';
    if (diffInSeconds < 3600) return `${now.diff(past, 'minute')}m`;
    if (diffInSeconds < 86400) return `${now.diff(past, 'hour')}h`;
    if (diffInSeconds < 604800) return `${now.diff(past, 'day')}d`;

    const diffInDays = now.diff(past, 'day');

    if (diffInDays === 7) return '1w';
    if (diffInDays >= 8 && diffInDays < 14) return '>1w';
    if (diffInDays === 14) return '2w';
    if (diffInDays >= 15 && diffInDays < 21) return '>2w';
    if (diffInDays === 21) return '3w';
    if (diffInDays >= 22 && diffInDays < 30) return '>3w';
    if (diffInDays === 30) return '30d';
    if (diffInDays > 30 && diffInDays < 365) return '>30d';

    if (diffInDays === 365) return '1y';
    if (diffInDays > 365) return '>1y';

    return 'N/A';
}

export default getTimeDiff;

// run bun src/pages/Notification/utils/getTimeDiff.test.ts
