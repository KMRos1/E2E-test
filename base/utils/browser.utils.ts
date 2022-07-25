import { ElementHandle, Locator, Page } from '@playwright/test'
import * as fs from 'fs'
import * as path from 'path'
import { Cookie } from '../../data/cookies/cookie'
import { Time } from './timeout'
import { runWithTimeout } from './promise-factory'

// TODO (marcin) check if anything useful in https://github.com/qawolf/playwright-utils/commit/d5035f315846d5c0a8ff41812f8c8737464d8a92
// TODO (marcin) check if anything useful in https://github.com/ccpu/playwright-utils/tree/master/packages/page/src
export class BrowserUtils {
    constructor(protected readonly page: Page) {}

    public async disableAnimations(): Promise<void> {
        await this.page.mainFrame().addStyleTag({
            content: `*, ::before, ::after {
                transition-property: none !important;
                transition-duration: 0s !important;
                transition: none !important;
                animation: none !important;
                animation-duration: 0s !important;
            }`,
        })
    }

    public async getCodeCoverage(): Promise<void> {
        const coverage: string = await this.evaluate('JSON.stringify(window.__coverage__);', undefined)
        if (coverage) {
            console.log(`Coverage retrieved (${coverage.length} bytes)`)
            fs.mkdirSync(path.join(__dirname, '..', '.nyc_output'))
            fs.writeFileSync(path.join(__dirname, '..', '.nyc_output', 'out.json'), coverage)
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const NYC = require('nyc')
            const nycInstance = new NYC({
                cwd: path.join(__dirname, '..'),
                reportDir: `coverage-e2e`,
                reporter: ['lcov', 'json', 'text-summary'],
            })
            nycInstance.report()
            nycInstance.cleanup()
            console.log('Coverage saved successfully!')
        } else {
            console.log('No coverage data!')
        }
    }

    // TODO(everyone): Figure out typings, can't import playwright-core inside playwring
    // https://app.shortcut.com/packhelp/story/40937/figure-out-typings-for-browserutils-evaluate-function
    public async evaluate<R, Arg>(fn, arg): Promise<R> {
        const timeout = Time.DEFAULT_LOCATOR_WAIT
        const evalPromise = this.page.evaluate<R, Arg>(fn, arg)
        return await runWithTimeout(evalPromise, timeout)
    }

    public async getSelectorElement(selector: string): Promise<ElementHandle<Element> | null> {
        return await this.page.$(selector)
    }

    public async getSelectorElements(selector: string): Promise<ElementHandle<Element>[]> {
        return await this.page.$$(selector)
    }

    public url(): URL {
        // We use mainFrame().url() instead of just url() here because:
        // * They ought to be equivalent in every case we care to test
        // * There is at least one edge case (the background page) where we've seen puppeteer
        //   mis-populating url() but not target().url() as ':', and we don't know that Playwright
        //   fixed that.
        return new URL(this.page.mainFrame().url())
    }

    public async getOuterHTML(selectorOrLocator: string | Locator): Promise<string> {
        let elementToUse
        if (typeof selectorOrLocator === 'string') {
            elementToUse = await this.page.locator(selectorOrLocator).elementHandle()
        } else {
            elementToUse = await selectorOrLocator.elementHandle()
        }
        if (elementToUse) {
            return await elementToUse.evaluate((element) => element.outerHTML)
        } else {
            throw new Error('Failed to get outerHtml. Element not found.')
        }
    }

    public async injectScriptFile(filePath: string): Promise<void> {
        await this.page.addScriptTag({ path: filePath })
        await this.page.waitForLoadState()
    }

    public async setViewport(width: number, height: number): Promise<void> {
        await this.page.setViewportSize({ width, height })
    }

    public async setFileForUpload(filepath: string) {
        this.page.once('filechooser', async (fileChooser) => {
            await fileChooser.element().setInputFiles(filepath)
        })
    }

    public async addCookies(cookies: Cookie[]) {
        const context = this.page.context()
        if (cookies && cookies.length > 0) {
            console.log(`${this.page.url()}`)
            console.log(`   Adding cookies:`)
            cookies.forEach((cookie) => console.log(`      ${JSON.stringify(cookie)}`))
            await context.addCookies(cookies)
        }
    }
}
