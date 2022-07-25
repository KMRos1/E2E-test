import { Page, Locator } from '@playwright/test'
import { PageObject } from '../base/base-pages/page-object'
import { AppUrl } from '../utils/app-url'

const collabolatorPageUrl = new AppUrl({
    com: '/comments',
})

export class CollaborationPage extends PageObject {
    $ = {
        editCollaborators: this.page.locator('[title="Edit collaborators"]'),
        collaboratorInput: this.page.locator('#collaborators'),
        permissionsList: this.page.locator('#permissions'),
        approveUser: (email: string) => this.page.locator(`text=(${email})`).nth(1),
        inviteButton: this.page.locator('button:has-text("Invite")'),
        permissionRole: (roleOption: string) => this.$.permissionsList.locator(`text=${roleOption}`),
        doneButton: this.page.locator('text=Done'),
        collabolatorTitle: (title: string) => this.page.locator(`[title = "${title}"]`),
    }

    constructor(page: Page) {
        super(page, collabolatorPageUrl)
    }

    async waitForPageLoad(): Promise<void> {
        await this.$.editCollaborators.hover()
    }

    async openCollaboratorModal(): Promise<void> {
        this.$.editCollaborators.click()
    }

    async addUser(email: string): Promise<void> {
        await this.$.collaboratorInput.click()
        await this.$.collaboratorInput.type(email)
        await this.$.approveUser(email).click()
    }

    async chooseRole(optionNumber: string, userType: string): Promise<void> {
        const textContent = await this.$.permissionsList.textContent()
        const substring = 'Can ViewCan ViewCan EditOwner'
        await this.$.permissionsList.click()
        if (textContent.includes(substring) && userType == 'supplier') {
            throw new Error('Supplier cannot be set as owner')
        }
        await this.$.permissionRole(optionNumber).click()
    }

    async inviteCollaborator(): Promise<void> {
        await this.$.inviteButton.click({ delay: 500 })
    }
}
