import { GlobalConfig } from "../env/global";

const isLookupTriger = (input: string, lookupTriggr: string): boolean => {
    return !!(lookupTriggr && input.startsWith(lookupTriggr))
}

const getLookupVariable = (input: string, lookupTrigger: string, config: GlobalConfig): string => {
    const replaceInput = input.slice(lookupTrigger.length)
    console.log(process.env)
    const lookupValue = config.emailsConfig[replaceInput] || process.env[replaceInput]

    if (!lookupValue) {
        throw Error(`Не удалось получить триггер поиска ${input}`)
    }

    return lookupValue
}

export const parseInput = (input: string, config: GlobalConfig): string => {
    const lookupTrigger = process.env.VAR_LOOKUP_TRIGGER ?? "$."
    return isLookupTriger(input, lookupTrigger) ? getLookupVariable(input, lookupTrigger, config) : input
}