export const dateNormalize = (date: string) => {
    return date.replace(/[^\d./]/g, '')
}