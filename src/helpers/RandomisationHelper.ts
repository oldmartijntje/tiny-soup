export function getRandomFiveCharNumber(): string {
    const randomNum = Math.floor(Math.random() * 99999) + 1;
    return randomNum.toString().padStart(5, '0');
}


