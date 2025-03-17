'use client';
import { useState } from "react";
import { useGetTransactionsQuery } from "@/lib/features/transactions/transactionsApi";
import { useGetExchangeRatesQuery } from "@/lib/features/exchange/exchangeApi";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const [page, setPage] = useState(1);
    const { data: transactions, isLoading, error } = useGetTransactionsQuery(page);
    const { data: exchangeRates } = useGetExchangeRatesQuery();
    const router = useRouter();


    const handlePrevious = () => setPage(p => Math.max(1, p - 1));
    const handleNext = () => setPage(p => Math.min(transactions?.last_page || 1, p + 1));

    if (isLoading) return <div>Loading transactions...</div>;
    if (error) return <div>Error loading transactions</div>;

    return (
        <div className="p-8">
            <div className="mb-10 flex justify-between items-center align-center">
                <div>
                    <h1 className="text-2xl font-bold">Your Transactions</h1>
                </div>
                <Button className="cursor-pointer" onClick={() => router.push('/convert')}>
                    Convert Currency
                </Button>
            </div>
            {exchangeRates && (
                <div className="my-6 text-sm text-gray-500 flex gap-4">
                    {Object.entries(exchangeRates.rates).map(([currency, rate]) => (
                        <span key={currency}>
                            1 USD = {rate} {currency}
                        </span>
                    ))}
                </div>
            )}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>From</TableHead>
                        <TableHead>To</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Converted Amount</TableHead>
                        <TableHead>Rate</TableHead>
                        <TableHead>Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions?.data?.map((transaction) => (
                        <TableRow key={transaction.id}>
                            <TableCell>{transaction.source_currency}</TableCell>
                            <TableCell>{transaction.target_currency}</TableCell>
                            <TableCell>{transaction.amount} {transaction.source_currency}</TableCell>
                            <TableCell>{transaction.converted_amount} {transaction.target_currency}</TableCell>
                            <TableCell>{transaction.conversion_rate}</TableCell>
                            <TableCell>{new Date(transaction.created_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="mt-4">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handlePrevious();
                                }}
                                className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                            />
                        </PaginationItem>

                        {[...Array(transactions?.last_page)].map((_, i) => (
                            <PaginationItem key={i + 1}>
                                <PaginationLink
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setPage(i + 1);
                                    }}
                                    isActive={page === i + 1}
                                >
                                    {i + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleNext();
                                }}
                                className={page === transactions?.last_page ? 'pointer-events-none opacity-50' : ''}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}