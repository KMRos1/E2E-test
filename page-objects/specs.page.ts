import { Page, Locator } from '@playwright/test'
import { PageObject } from '../base/base-pages/page-object'
import { AppUrl } from '../utils/app-url'

const specPageUrl = new AppUrl({
    com: 'app/c/specs',
})

export class SpecsPage extends PageObject {
    $ = {
        createNewSpecButton: this.page.locator('text=Create new spec'),
        createFromScratchButton: this.page.locator('text=Create from scratch'),
        specNameInput: this.page.locator('#name'),
        specIdInput: this.page.locator('#specNumber'),
        nextButton: this.page.locator('button:has-text("Next")'),
        unLockedButton: this.page.locator('button:has-text("Lock spec")'),
        lockedButton: this.page.locator('button:has-text("Locked")'),
        confirmButton: this.page.locator('button:has-text("Yes, lock spec")'),
    }
    constructor(page: Page) {
        super(page, specPageUrl)
    }
    async waitForPageLoad(): Promise<void> {
        await this.$.createNewSpecButton.hover()
    }
    async visit(): Promise<void> {
        await this.page.click('text=Specs')
    }
    async createNewSpecFromScratch(): Promise<void> {
        await this.$.createNewSpecButton.click()
        await this.$.createFromScratchButton.click()
    }
    async fakeSpecParams(specName: string, specId: string): Promise<void> {
        await this.$.specNameInput.fill(specName)
        await this.$.specIdInput.fill(specId)
    }
    async clickNextButton(buttonLocator: Locator, endpoint: string): Promise<void> {
        await buttonLocator.click()
        await this.page.waitForNavigation({
            url: (url) => url.toString().includes(endpoint),
        })
    }
}
