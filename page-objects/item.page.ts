import { Page, Locator } from '@playwright/test'
import { PageObject } from '../base/base-pages/page-object'
import { AppUrl } from '../utils/app-url'

const itemPageUrl = new AppUrl({
    com: 'app/c/items',
})
export class ItemPage extends PageObject {
    $ = {
        createItemButton: this.page.locator('[aria-controls="createItem"]'),
        createSingleItem: this.page.locator('text=Create single item'),
        itemNameInput: this.page.locator('#name'),
        itemIdInput: this.page.locator('#itemNumber'),
        specSelector: this.page.locator('text=Choose spec'),
        tagsInput: this.page.locator('#typeahead-tags'),
        saveButton: this.page.locator('button:has-text("Save")'),
        tagApprove: this.page.locator('[tabindex="-1"]'),
        itemLockedToast: this.page.locator('text=Item locked.'),
        lockButton: this.page.locator('button:has-text("Lock item")'),
        confirmLockButon: this.page.locator('button:has-text("Yes, lock item")'),
        specsList: this.page.locator('text=No options'),
    }
    constructor(page: Page) {
        super(page, itemPageUrl)
    }
    async visit(): Promise<void> {
        await this.page.click('text=Items')
    }
    async waitForPageLoad(): Promise<void> {
        await this.$.createItemButton.hover()
    }
    async openItemWizard(): Promise<void> {
        await this.$.createItemButton.click()
        await this.$.createSingleItem.click()
    }
    async fakeItemParams(itemName: string, itemId: string): Promise<void> {
        await this.$.itemNameInput.fill(itemName)
        await this.$.itemIdInput.fill(itemId)
    }
    async linkSpec(spec: string): Promise<void> {
        await this.$.specSelector.click()
        await this.$.specSelector.fill(spec)
        await this.$.specsList.waitFor({ state: 'hidden' })
        await this.page.keyboard.press('Enter')
    }
    async addTag(tag: string): Promise<void> {
        await this.$.tagsInput.click()
        await this.$.tagsInput.type(tag)
        await this.$.tagApprove.click()
    }
    async lockItem(): Promise<void> {
        await this.$.lockButton.click()
        await this.$.confirmLockButon.click()
        await this.$.itemLockedToast.waitFor()
    }
    async clickNextButton(buttonLocator: Locator, endpoint: string): Promise<void> {
        await buttonLocator.click()
        await this.page.waitForNavigation({
            url: (url) => url.toString().includes(endpoint),
        })
    }
}
