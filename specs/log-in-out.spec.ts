import { test, expect } from '@playwright/test'
import { LogInOutPage } from '../page-objects/log-in-out.page'
import { User } from '../data/user.data'

test.describe('Log in and log out checkout', async () => {
    let logInPage: LogInOutPage
    const newUser: User = new User()

    const testData = {
        errorMessage: 'Incorrect email address or password',
        signOutMessage: 'Good to see you again!',
        ordersListEndpoint: '/app/c/orders',
        loginEndpoint: '/auth/login',
    }
    test('Log in and log out ', async ({ page }) => {
        logInPage = new LogInOutPage(page)
        await logInPage.load()
        await logInPage.login('', '')
        await expect(logInPage.$.errorMessage).toContainText(testData.errorMessage)
        await logInPage.login(newUser.email, newUser.password)
        await page.waitForNavigation({
            url: (url) => url.toString().includes(testData.ordersListEndpoint),
        })
        await expect(page.url()).toContain(testData.ordersListEndpoint)
        await logInPage.logout()
        await expect(logInPage.$.singOutMessage).toContainText(testData.signOutMessage)
        await expect(page.url()).toContain(testData.loginEndpoint)
    })
})
