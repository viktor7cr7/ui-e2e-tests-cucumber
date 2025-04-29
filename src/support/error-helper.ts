import { ErrorsConfig, WaitForTarget, WaitForTargetType } from "../env/global";

export const getErrorSummary = (errorDetail: string): string => {
    return errorDetail.split('\n')[0]
}

export const parseErrorMessage = (errList: ErrorsConfig, errorSummary: string, targetName: string, targetType: string): string => {
    const targetErrorIndex =  errList.map(error => RegExp(error.originalErrMsgRegexString)).findIndex((error => error.test(errorSummary)))

    return targetErrorIndex > -1 ? errList[targetErrorIndex].parsedErrMsg.replace(/{}/g, targetName).replace(/<>/g, targetType) : errorSummary
}

export const handleError = (errList: ErrorsConfig, err: Error, target? : WaitForTarget, type?: WaitForTargetType): void => {
    const errorDetail = err?.message ?? ''
    const errorSummary = getErrorSummary(errorDetail)
    const targetName = target ?? ''
    const targetType = type ?? ''

    if (!errList || !errorSummary) {
        console.error(errorDetail)
        throw Error(errorDetail)
    }

    const parsedErrorMessage = parseErrorMessage(errList, errorSummary, targetName, targetType)

    console.error(parsedErrorMessage)
    throw new Error(parsedErrorMessage)
} 