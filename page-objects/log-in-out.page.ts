import { Page, Locator } from '@playwright/test'
import { PageObject } from '../base/base-pages/page-object'
import { AppUrl } from '../utils/app-url'

const loginPageUrl = new AppUrl({
    com: '/auth/login',
})

export class LogInOutPage extends PageObject {
    $ = {
        userNameInput: this.page.locator('input[name="email"]'),
        passwordInput: this.page.locator('input[name="password"]'),
        submitButton: this.page.locator('button:has-text("Login")'),
        errorMessage: this.page.locator('text="Incorrect email address or password"'),
        avatarIcon: this.page.locator('[e2e-target="avatar"]').nth(0),
        signOut: this.page.locator('text=Sign out'),
        singOutMessage: this.page.locator('h1'),
    }

    constructor(page: Page) {
        super(page, loginPageUrl)
    }

    async waitForPageLoad(): Promise<void> {
        await this.$.userNameInput.hover()
    }

    async login(userName: string, password: string): Promise<void> {
        await this.$.userNameInput.fill(userName)
        await this.$.passwordInput.fill(password)
        await this.$.submitButton.click()
    }
    async logout(): Promise<void> {
        await this.$.avatarIcon.click()
        await this.$.signOut.click()
    }
}
