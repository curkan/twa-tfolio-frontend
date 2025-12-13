export const useHumanizeNumber = (num: number) => {
    const suffixes = ['', 'тыс.', 'млн', 'мрд', 'трлн'];
    const base = 1000;
    let i = 0;

    while (num >= base && i < suffixes.length - 1) {
        num /= base;
        i++;
    }

    return `${num.toFixed(0)} ${suffixes[i]}`;
}

