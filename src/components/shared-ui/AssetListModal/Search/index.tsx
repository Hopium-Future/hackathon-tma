import React, { useEffect } from 'react';

import { useDebounceValue } from 'usehooks-ts';

import create from 'zustand';

import SearchIcon from '@/components/icons/SearchIcon';

import classNames from 'classnames';

interface SearchState {
    query: string;
    debouncedQuery: string;
    setQuery: (query: string) => void;
    setDebouncedQuery: (debouncedQuery: string) => void;
}

const useAssetSearchStore = create<SearchState>((set) => ({
    query: '',
    debouncedQuery: '',
    setQuery: (query) => set({ query }),
    setDebouncedQuery: (debouncedQuery) => set({ debouncedQuery })
}));

export { useAssetSearchStore };

const Search: React.FC = () => {
    const { query, setQuery, setDebouncedQuery } = useAssetSearchStore();
    const [debouncedQuery] = useDebounceValue(query, 500);

    useEffect(() => {
        setDebouncedQuery(debouncedQuery);
    }, [debouncedQuery]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    return (
        <div className="relative flex items-center w-full bg-background-3 border-divider border-[0.5px] rounded h-10 px-3 focus-within:border-green-1">
            <SearchIcon className="mr-2" />
            <input
                value={query}
                type="text"
                placeholder="Search token"
                className={classNames('w-full bg-transparent focus:outline-none dark:text-white text-md', {
                    'mr-6': query
                })}
                onChange={handleInputChange}
            />
        </div>
    );
};
export default Search;
