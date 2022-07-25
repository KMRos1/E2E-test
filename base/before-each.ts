import { expect, test } from '@playwright/test'
import { mockLiveChatFunctions } from '../mocks/livechat_mock'
import { mockSegmentRequests } from '../mocks/segment_mock'

const textMatchesStringOrRegexp = (text: string, array: Array<RegExp | string>): boolean => {
    if (Array.isArray(array)) {
        for (let index = 0; index < array.length; index++) {
            if (typeof array[index] === 'string') {
                if (text === array[index]) return true
            } else {
                if ((array[index] as RegExp).test(text)) return true
            }
        }
        return false
    }
    return false
}

const forceEventFailure = (location: string, event: string, description: string): void => {
    const forceTestFailure = (errorMessage: string): void => {
        expect(errorMessage).toBeNull()
    }
    const errorMessage = `${location} emitted '${event}' ${description}`
    console.error(errorMessage)
    // throw new Error(errorMessage)
    forceTestFailure(errorMessage)
}

interface ThrowErrorOnJsProps {
    whitelistedErrors?: string[]
}

interface FailOnRequestErrorProps {
    whitelistedRequests?: (RegExp | string)[]
}

export class BeforeEach {
    static mockSegmentRequests = () => {
        return test.beforeEach(async ({ page }) => {
            await mockSegmentRequests(page)
        })
    }

    static mockLiveChat = () => {
        return test.beforeEach(async ({ page }) => {
            await mockLiveChatFunctions(page)
        })
    }

    static setDefaultRequestMocks = () => {
        return test.beforeEach(async ({ page }) => {
            await mockLiveChatFunctions(page)
            await mockSegmentRequests(page)
        })
    }

    static failOnJsError = (props?: ThrowErrorOnJsProps) => {
        const defaultJsWhitelistedErrors = ["Cannot read property 'focusElement' of null"]
        const prepareWhitelistedErrors = () => {
            if (props && props.whitelistedErrors) return [...defaultJsWhitelistedErrors, ...props.whitelistedErrors]
            else return [...defaultJsWhitelistedErrors]
        }
        const whitelistedErrors = prepareWhitelistedErrors()

        return test.beforeEach(async ({ page }) => {
            page.on('pageerror', (error) => {
                const stringifiedError = JSON.stringify(error, Object.getOwnPropertyNames(error))

                if (textMatchesStringOrRegexp(error.message, whitelistedErrors)) {
                    return
                }

                if (`${error.message}` === 'Object') {
                    // unknown flakiness, tracked by https://github.com/microsoft/accessibility-insights-web/issues/3529
                    console.warn(`'pageerror' (console.error): ${stringifiedError}`)
                    console.warn(
                        `unknown flakiness, tracked by https://github.com/microsoft/accessibility-insights-web/issues/3529`
                    )
                    return
                }

                forceEventFailure('BeforeEach.failOnJsError:', 'pageerror', `${page.url()} ${stringifiedError}`)
            })
        })
    }

    static failOnRequestError = (props?: FailOnRequestErrorProps) => {
        return test.beforeEach(async ({ page }) => {
            page.on('requestfailed', (request) => {
                const failure = request.failure()
                const url = request.url()
                const missingFont = url.indexOf('fonts') > -1
                const missingIcon = url.indexOf('icons') > -1
                const whitelistedUrl = () => {
                    if (props && props.whitelistedRequests)
                        return textMatchesStringOrRegexp(url, props.whitelistedRequests)
                }

                if (missingFont || missingIcon || whitelistedUrl()) return

                forceEventFailure(
                    'BeforeEach.failOnRequestError:',
                    'requestfailed',
                    `from '${url}' with errorText: ${failure?.errorText}`
                )
            })
        })
    }

    static failOnResponseErrorCode = (props?: FailOnRequestErrorProps) => {
        return test.beforeEach(async ({ page }) => {
            page.on('response', (response) => {
                const statusCode = response.status()
                if (statusCode >= 400) {
                    const url = response.url()
                    const whitelistedUrl = () => {
                        if (props && props.whitelistedRequests)
                            return textMatchesStringOrRegexp(url, props.whitelistedRequests)
                    }
                    if (whitelistedUrl()) return

                    forceEventFailure(
                        'BeforeEach.failOnResponseErrorCode:',
                        'response',
                        `from '${url}' with non-successful status '${statusCode}: ${response.statusText()}'`
                    )
                }
            })
        })
    }
}
