export function getRandomFiveCharNumber(): string {
    const randomNum = Math.floor(Math.random() * 99999) + 1;
    return randomNum.toString().padStart(5, '0');
}

export function getRandomAlphaNumString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        result += chars[randomIndex];
    }
    return result;
}
