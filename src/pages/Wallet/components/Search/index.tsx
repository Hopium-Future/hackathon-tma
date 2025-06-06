import React, { useState, useEffect } from 'react';
import create from 'zustand';
import { useDebounceValue } from 'usehooks-ts';
import SearchIcon from '@/components/icons/SearchIcon';
import CloseInputIcon from '@/components/icons/CloseInputIcon';
import colors from '@/config/colors';
import classNames from 'classnames';

interface SearchState {
    query: string;
    debouncedQuery: string;
    setQuery: (query: string) => void;
    setDebouncedQuery: (debouncedQuery: string) => void;
}

const useSearchStore = create<SearchState>((set) => ({
    query: '',
    debouncedQuery: '',
    setQuery: (query) => set({ query }),
    setDebouncedQuery: (debouncedQuery) => set({ debouncedQuery })
}));

export { useSearchStore };

const SearchComponent: React.FC = () => {
    const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
    const { query, setQuery, setDebouncedQuery } = useSearchStore();
    const [debouncedQuery] = useDebounceValue(query, 500);

    useEffect(() => {
        setDebouncedQuery(debouncedQuery);
    }, [debouncedQuery]);

    const handleToggle = () => {
        setIsSearchOpen((prev) => !prev);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    return (
        <div className="relative flex items-center">
            <div className="flex items-center">
                <section className="w-5 h-5">
                    <SearchIcon className={`${isSearchOpen ? 'mr-2 cursor-default' : 'cursor-pointer'}`} onClick={handleToggle} />
                </section>
                <div className={`relative ml-2 flex items-center transition-all duration-300 overflow-hidden ${isSearchOpen ? 'w-[90px]' : 'w-0'}`}>
                    <input
                        type="text"
                        value={query}
                        onChange={handleInputChange}
                        placeholder="Search token"
                        className={classNames('w-full bg-transparent focus:outline-none dark:text-white text-md', {
                            'mr-6': query
                        })}
                        style={{ caretColor: colors.green?.[1] }}
                    />
                    {query && isSearchOpen && <CloseInputIcon onClick={() => setQuery('')} size="sm" className="absolute right-0 text-main" />}
                </div>
            </div>
        </div>
    );
};

export default SearchComponent;
