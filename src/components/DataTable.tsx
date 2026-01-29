import { useState, memo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
    flexRender, 
    useReactTable, 
    getCoreRowModel, 
    getFilteredRowModel, 
    getPaginationRowModel, 
    getSortedRowModel,
    type ColumnDef,
    type SortingState,
    type PaginationState,
} from '@tanstack/react-table';
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowLeft, ArrowRight } from 'lucide-react';
import { Input } from "@/components/ui/input";

interface DataTableProps<TData> {
    data: TData[];
    columns: ColumnDef<TData, unknown>[];
    pageSize?: number;
    searchable?: boolean;
}

export const DataTable = memo(function DataTable<TData> ( { data, columns, pageSize = 15, searchable = true }: DataTableProps<TData> ) {
    const finalColumns: ColumnDef<TData, any>[] = columns.map( col => {
        if ( col?.enableSorting ) {
            const currentHeaderText = typeof col?.header === 'string' ? col.header : ( col as any ).accessorKey;
            return {
                ...col,
                header: ( { column } ) => {
                    const isSorted = column.getIsSorted() === 'asc';
                    return (
                        <Button 
                            size="sm" 
                            onClick={ () => column.toggleSorting(isSorted) } 
                        >
                            {currentHeaderText} <ArrowUp className={ isSorted ? 'rotate-180' : '' } />
                        </Button>
                    )
                }
            } as ColumnDef<TData, any>;
        }
        return col as ColumnDef<TData, any>;
    } );

    const [ search, setSearch ]         = useState('');
    const [ pagination, setPagination ] = useState<PaginationState>( { pageIndex: 0, pageSize } );
    const [ sorting, setSorting ]       = useState<SortingState>( [
        {
            id: 'id',
            desc: true
        }
    ] );

    const table = useReactTable( {
        data,
        columns: finalColumns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        onGlobalFilterChange: setSearch,
        state: {
            sorting,
            pagination,
            globalFilter: search
        }
    } );

    return (
        <div className="space-y-4">
            { searchable ? (
                <Input 
                    type="search"
                    placeholder="Search something..." 
                    onChange={ e => {
                        setPagination( { ...pagination, pageIndex: 0 } )
                        setSearch( String(e.target.value) )
                    } }
                />
            ) : null }
            <Table>
                <TableHeader>
                    { table.getHeaderGroups().map( headerGroup => (
                        <TableRow key={ headerGroup.id }>
                            { headerGroup.headers.map( header => {
                                return (
                                    <TableHead key={ header.id }>
                                        { header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext()) }
                                    </TableHead>
                                )
                            } ) }
                        </TableRow>
                    ) ) }
                </TableHeader>
                <TableBody>
                    { table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map( row => (
                            <TableRow key={ row.id }>
                                { row.getVisibleCells().map( cell => (
                                    <TableCell key={ cell.id }>
                                        { flexRender(cell.column.columnDef.cell, cell.getContext()) }
                                    </TableCell>
                                ) ) }
                            </TableRow>
                        ) )
                    ) : (
                        <TableRow>
                            <TableCell colSpan={ columns.length }>
                                No results.
                            </TableCell>
                        </TableRow>
                    ) }
                </TableBody>
            </Table>
            <div className="flex items-center justify-between pb-3">
                <div className="text-sm text-muted-foreground">
                    { table.getRowModel().rows.length } of { table.getFilteredRowModel().rows.length } items
                </div>
                <div className="flex items-center gap-x-2">
                    <Button
                        onClick={ () => table.previousPage() }
                        disabled={ !table.getCanPreviousPage() }
                    >
                        <ArrowLeft className="size-4" />
                        Previous
                    </Button>
                    <Button
                        onClick={ () => table.nextPage() }
                        disabled={ !table.getCanNextPage() }
                    >
                        Next
                        <ArrowRight className="size-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
} ) as <TData> ( props: DataTableProps<TData> ) => React.ReactElement;
