import { Page, Locator } from '@playwright/test'
import { PageObject } from '../base/base-pages/page-object'
import { AppUrl } from '../utils/app-url'

const commentPageUrl = new AppUrl({
    com: '/comments',
})

export class CommentsPage extends PageObject {
    $ = {
        commentArea: this.page.locator('[e2e-target="textarea"]'),
        inputFile: this.page.locator('[type="file"]'),
        sendButton: this.page.locator('button:has-text("Send")'),
        abortButton: this.page.locator('button:has-text("Abort upload")'),
    }

    constructor(page: Page) {
        super(page, commentPageUrl)
    }

    async waitForPageLoad(): Promise<void> {
        await this.$.commentArea.hover()
    }

    async addComment(text: string): Promise<void> {
        await this.$.commentArea.type(text)
    }

    async addFile(image: string): Promise<void> {
        await this.$.inputFile.setInputFiles(image)
        await this.$.abortButton.waitFor()
        await this.$.abortButton.waitFor({ state: 'hidden' })
    }

    async sendComment(): Promise<void> {
        await this.$.sendButton.click({ delay: 500 })
    }
}
