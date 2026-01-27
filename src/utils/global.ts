export function currencyFormat ( value: number | string ): string {
    const num = Number(value);
    return num.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
    });
}

export function capitalize ( value: string ): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
}