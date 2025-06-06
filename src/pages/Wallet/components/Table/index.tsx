import { FC, useMemo } from 'react';

import { CellProps, useSortBy, useTable, Column } from 'react-table';

import { formatBalance } from '@/helper';

import useFuturesConfig from '@/stores/futures.store';

import SortIcon from '@/components/icons/SortIcon';
import AssetLogo from '@/components/common/AssetLogo';
import EmptyIcon from '@/components/icons/EmptyIcon';
import LockIcon from '@/components/icons/LockIcon';

import { useSearchStore } from '@/pages/Wallet/components/Search';
import { Asset, TableData, WalletProps } from '@/pages/Wallet/types';
import { ASSET_ID_L_USDT, ASSET_ID_C_USDT, ASSET_ID_USDT } from '@/pages/Wallet/constants';

const ALLOW_USDT = [ASSET_ID_C_USDT, ASSET_ID_L_USDT];

const TableComponent: FC<{ wallet: WalletProps[] }> = ({ wallet }) => {
    const debouncedQuery = useSearchStore((state) => state.debouncedQuery);
    const assetConfig = useFuturesConfig((state) => state.assetsConfig);

    const result: TableData[] = useMemo(() => {
        if (!wallet) return [];

        // Lọc tài sản giao dịch
        const transactionAssets: Asset[] = assetConfig.filter((asset) => {
            const walletItem = wallet.find((item) => +item?.assetId === asset?.id);
            const isTransactionAsset = [ASSET_ID_USDT, ASSET_ID_C_USDT, ASSET_ID_L_USDT].includes(asset?.id);

            // Nếu là transaction asset nhưng value = 0, chuyển sang collateralAssets
            // Thêm kiểm tra walletTypes['MAIN']
            return isTransactionAsset && (walletItem?.value || 0) > 0 && Boolean(asset?.walletTypes?.['MAIN']);
        });

        // Lọc tài sản thế chấp
        const collateralAssets: Asset[] = assetConfig.filter((asset) => {
            const walletItem = wallet.find((item) => +item?.assetId === asset?.id);
            const isTransactionAsset = [ASSET_ID_USDT, ASSET_ID_C_USDT, ASSET_ID_L_USDT].includes(asset?.id);

            // Bao gồm tài sản không phải transaction asset hoặc có value = 0
            // Thêm kiểm tra walletTypes['MAIN']
            return (!isTransactionAsset || (walletItem?.value || 0) === 0) && Boolean(asset?.walletTypes?.['MAIN']);
        });

        // Kết hợp tài sản
        const combineAssets: any = (assets: Asset[]) => {
            return assets.map((asset) => {
                const walletItem = wallet.find((item) => +item?.assetId === asset?.id);
                const combinedAsset = {
                    ...asset,
                    ...walletItem,
                    ltv: ALLOW_USDT.includes(asset?.id) ? 1 : walletItem?.ltv,
                    value: walletItem?.value || 0
                };
                return combinedAsset;
            });
        };

        // Sắp xếp tài sản
        const sortAssets = (assets: TableData[]) => {
            const priorityOrder = [ASSET_ID_USDT, ASSET_ID_C_USDT, ASSET_ID_L_USDT];

            return assets.sort((a, b) => {
                if ((b.value || 0) - (a.value || 0) !== 0) {
                    return (b.value || 0) - (a.value || 0);
                }

                if (priorityOrder.includes(a.id) && priorityOrder.includes(b.id)) {
                    return priorityOrder.indexOf(a.id) - priorityOrder.indexOf(b.id);
                }

                if ((b.ltv || 0) - (a.ltv || 0) !== 0) {
                    return (b.ltv || 0) - (a.ltv || 0);
                }

                return (a.assetCode || '').toUpperCase().localeCompare((b.assetCode || '').toUpperCase());
            });
        };

        const combinedTransactionAssets: TableData[] = sortAssets(combineAssets(transactionAssets));
        const combinedCollateralAssets: TableData[] = sortAssets(combineAssets(collateralAssets));

        return [...combinedTransactionAssets, ...combinedCollateralAssets];
    }, [wallet, assetConfig]);

    const filteredResult = useMemo(() => {
        const normalizedQuery = debouncedQuery?.replace(/\s+/g, '').toLowerCase();
        return normalizedQuery ? result.filter((item) => item?.assetCode?.toLowerCase().replace(/\s+/g, '').includes(normalizedQuery)) : result;
    }, [debouncedQuery, result]);

    const columns: Column<TableData>[] = useMemo(
        () => [
            {
                Header: 'Token',
                accessor: 'assetCode',
                className: 'text-left',
                Cell: ({ value, row }: CellProps<TableData, string>) => {
                    const assetId = row.original.assetId;
                    return (
                        <section className="flex items-center gap-x-2">
                            <AssetLogo assetId={assetId} />
                            <p className="font-bold flex gap-x-1 items-center">
                                {value}
                                {ALLOW_USDT.includes(assetId) && <LockIcon size="xs" color="#9D9D9D" />}
                            </p>
                        </section>
                    );
                },
                sortType: (rowA: { values: { [x: string]: string } }, rowB: { values: { [x: string]: string } }, columnId: string | number) => {
                    const valueA = rowA.values[columnId].toLowerCase();
                    const valueB = rowB.values[columnId].toLowerCase();
                    return valueA.localeCompare(valueB);
                }
            },
            {
                Header: 'Balance',
                accessor: 'value',
                className: 'text-right justify-end',
                Cell: ({ value, row }: CellProps<TableData, number>) => {
                    const assetDigit = row?.original?.assetDigit || 4;
                    return formatBalance(Math.max(+value, 0), assetDigit);
                },
                sortType: (rowA: { values: { [x: string]: number } }, rowB: { values: { [x: string]: number } }, columnId: string | number) => {
                    return rowB.values[columnId] - rowA.values[columnId];
                }
            },
            {
                Header: 'LTV',
                accessor: 'ltv',
                className: 'text-right justify-end',
                Cell: ({ value }: CellProps<TableData, number>) => {
                    return value > 0 ? value : '-';
                },
                sortType: (
                    rowA: { values: { [x: string]: string | number } },
                    rowB: { values: { [x: string]: string | number } },
                    columnId: string | number
                ) => {
                    const valueA = +rowA.values[columnId] || 0;
                    const valueB = +rowB.values[columnId] || 0;

                    // Sắp xếp giảm dần
                    return valueB - valueA;
                }
            }
        ],
        []
    );

    const tableOptions = useMemo(
        () => ({
            columns,
            data: filteredResult || []
            //  disableSortRemove: true
        }),
        [columns, filteredResult]
    );

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(tableOptions, useSortBy);

    const renderEmpty = () => {
        return (
            <section className="mt-10 text-center">
                <EmptyIcon className="w-[100px] h-[100px]" />
                <p className="mt-1 text-sub text-md">Oops, no data</p>
            </section>
        );
    };

    return (
        <>
            {rows.length === 0 ? (
                renderEmpty()
            ) : (
                <table {...getTableProps()} className="w-full text-left table-fixed border-separate border-spacing-0 border-spacing-y-5">
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()} key={`tr-${headerGroup.id}`}>
                                {headerGroup.headers.map((column: any, index: number) => (
                                    <th
                                        {...column.getHeaderProps(column.getSortByToggleProps())}
                                        className="text-sm text-sub w-1/3"
                                        key={`${column.id}-${index}`}
                                    >
                                        <div className={`flex gap-x-1 items-center ${column.className} uppercase font-normal`}>
                                            {column.render('Header')}
                                            <SortIcon sort={column.isSorted ? (column.isSortedDesc ? 'desc' : 'asc') : ''} />
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {rows.map((row) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()} className="text-left" key={row.id}>
                                    {row.cells.map((cell: any) => (
                                        <td {...cell.getCellProps()} className={`${cell.column.className}`} key={`${row.id}-${cell.column.id}`}>
                                            {cell.render('Cell')}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </>
    );
};

export default TableComponent;
