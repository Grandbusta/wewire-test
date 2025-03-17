'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useConvertCurrencyMutation } from "@/lib/features/convert/convertApi";

export default function ConvertPage() {
    const router = useRouter();
    const [amount, setAmount] = useState('');
    const [sourceCurrency, setSourceCurrency] = useState('');
    const [targetCurrency, setTargetCurrency] = useState('');
    const [result, setResult] = useState<{ convertedAmount: number; rate: number } | null>(null);

    const [convertCurrency, { isLoading }] = useConvertCurrencyMutation();

    const currencies = ['USD','EUR','GBP','AUD','CAD','NGN'];

    const handleConvert = async () => {
        try {
            const response = await convertCurrency({
                source_currency: sourceCurrency,
                target_currency: targetCurrency,
                amount: Number(amount),
                idempotency_key: new Date().getTime().toString()
            }).unwrap();

            setResult({
                convertedAmount: response.converted_amount,
                rate: response.conversion_rate,
            });
        } catch (error) {
            console.error('Conversion failed:', error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-[400px]">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Convert Currency</CardTitle>
                            {/* <CardDescription>
                                Convert between different currencies using real-time exchange rates
                            </CardDescription> */}
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => router.push('/dashboard')}
                        >
                            Back to Transactions
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <Input
                                type="number"
                                placeholder="Amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="mb-2"
                            />
                        </div>
                        <div className="flex gap-4">
                            <Select
                                value={sourceCurrency}
                                onValueChange={setSourceCurrency}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="From" />
                                </SelectTrigger>
                                <SelectContent>
                                    {currencies.map((currency) => (
                                        <SelectItem key={currency} value={currency}>
                                            {currency}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={targetCurrency}
                                onValueChange={setTargetCurrency}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="To" />
                                </SelectTrigger>
                                <SelectContent>
                                    {currencies.map((currency) => (
                                        <SelectItem key={currency} value={currency}>
                                            {currency}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            className="w-full"
                            onClick={handleConvert}
                            disabled={!amount || !sourceCurrency || !targetCurrency || isLoading}
                        >
                            {isLoading ? 'Converting...' : 'Convert'}
                        </Button>
                    </div>
                </CardContent>
                {result && (
                    <CardFooter className="flex flex-col items-start gap-2">
                        <p className="text-lg font-semibold">
                            {amount} {sourceCurrency} = {result.convertedAmount} {targetCurrency}
                        </p>
                        <p className="text-sm text-gray-500">
                            Rate: 1 {sourceCurrency} = {result.rate} {targetCurrency}
                        </p>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
}