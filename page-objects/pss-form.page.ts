import { Page, Locator } from '@playwright/test'
import { PageObject } from '../base/base-pages/page-object'
import { AppUrl } from '../utils/app-url'

const pssPageUrl = new AppUrl({
    com: 'specs-edit/create?type=JSON&step=2',
})

export class PssFormPage extends PageObject {
    $ = {
        heightInput: this.page.locator('input[name="size__height"]'),
        depthInput: this.page.locator('input[name="size__depth"]'),
        widthInput: this.page.locator('input[name="size__width"]'),
        externalOption: this.page.locator('[e2e-data="External"]'),
        whiteCheckBox: this.page.locator(':nth-match(button:has-text("White"), 5)'),
        saveButton: this.page.locator('text=Save'),
    }

    constructor(page: Page) {
        super(page, pssPageUrl)
    }

    async fillSizeInputs(width: string, depth: string, height: string): Promise<void> {
        await this.$.widthInput.fill(width)
        await this.$.depthInput.fill(depth)
        await this.$.heightInput.fill(height)
    }
    async waitForPageLoad(): Promise<void> {
        await this.$.heightInput.hover()
    }
    async clickNextButton(buttonLocator: Locator, endpoint: string): Promise<void> {
        await buttonLocator.click()
        await this.page.waitForNavigation({
            url: (url) => url.toString().includes(endpoint),
        })
    }
}
