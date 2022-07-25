import { Page, Locator } from '@playwright/test'
import { PageObject } from '../base/base-pages/page-object'
import { AppUrl } from '../utils/app-url'

const designPageUrl = new AppUrl({
    com: 'app/c/designs',
})
export class DesignPage extends PageObject {
    $ = {
        designsTab: this.page.locator('text=Designs'),
        newDesignButton: this.page.locator('text=Upload new design'),
        designName: this.page.locator('#name'),
        designId: this.page.locator('#designNumber'),
        saveButton: this.page.locator('button:has-text("Save")'),
        addDesignPart: this.page.locator('[title="Upload new design part"]'),
        addButton: this.page.locator('button:has-text("Add")').nth(0),
        inputFile: this.page.locator('text=Add file or drop file here'),
        lockButton: this.page.locator('button:has-text("Lock design")'),
        confirmLockButon: this.page.locator('button:has-text("Yes, lock design")'),
        partCreated: this.page.locator('text=Part created.'),
        partFileSet: this.page.locator('text=Part file set.'),
        discardItem: this.page.locator('button:has-text("No")'),
        uploadedIcon: this.page.locator('text=Uploaded'),
        designLockedToast: this.page.locator('text=Design locked.'),
        closeItemModal: this.page.locator('[e2e-target-name="close"]'),
    }

    constructor(page: Page) {
        super(page, designPageUrl)
    }

    async waitForPageLoad(): Promise<void> {
        await this.$.newDesignButton.hover()
    }
    async createDesign(designName: string, designId: string, specArg: string, image: string) {
        await this.$.newDesignButton.click()
        await this.$.designName.fill(designName)
        await this.$.designId.fill(designId)
        await this.$.inputFile.setInputFiles(image)
        await this.$.uploadedIcon.waitFor()
    }
    async visit(): Promise<void> {
        await this.page.click('text=Designs')
    }
    async addPart(name: string, image: string): Promise<void> {
        await this.$.addDesignPart.click()
        await this.$.designName.fill(name)
        await this.$.addButton.click()
        await this.$.partCreated.waitFor()
        await this.$.inputFile.setInputFiles(image)
        await this.$.partFileSet.waitFor()
        await this.$.partFileSet.waitFor({ state: 'hidden' })
    }
    async lockDesign(): Promise<void> {
        await this.$.lockButton.click()
        await this.$.confirmLockButon.click()
        await this.$.closeItemModal.click()
        await this.$.designLockedToast.waitFor()
    }
    async clickNextButton(buttonLocator: Locator, endpoint: string): Promise<void> {
        await buttonLocator.click()
        await this.page.waitForNavigation({
            url: (url) => url.toString().includes(endpoint),
        })
    }
}
