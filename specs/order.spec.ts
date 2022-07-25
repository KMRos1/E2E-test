import { test, expect } from '@playwright/test'
import { LogInOutPage } from '../page-objects/log-in-out.page'
import { OrdersPage } from '../page-objects/orders.page'
import { User } from '../data/user.data'
import { TestData } from '../data/testData.data'
import { orderParams } from '../data/order.data'

test.describe('Add new order', async () => {
    let logInPage: LogInOutPage
    let ordersPage: OrdersPage
    const newUser: User = new User()
    const orderData = new TestData('order')

    test.beforeEach(async ({ page }) => {
        logInPage = new LogInOutPage(page)
        ordersPage = new OrdersPage(page)

        await logInPage.load()
        await logInPage.login(newUser.email, newUser.password)
    })

    test('Create order', async ({ page }) => {
        await ordersPage.$.addOrderButton.click()
        await expect(page.url()).toContain(orderParams.orderCreateEndpoint)
        await ordersPage.selectItem(orderParams.item2)
        await ordersPage.goNextStep()
        await ordersPage.waitForNextStep(2)
        await ordersPage.selectSupplier(orderParams.supplier)
        await ordersPage.goNextStep()
        await ordersPage.waitForNextStep(3)
        await ordersPage.addItem(
            orderParams.item1,
            orderParams.quantity,
            orderParams.unit,
            orderParams.currency,
            orderParams.price
        )
        await ordersPage.goNextStep()
        await ordersPage.waitForNextStep(4)
        await ordersPage.fakeOrderParams(orderData.name, orderData.id)
        await ordersPage.setShippingMethod(orderParams.shippingMethod)
        await ordersPage.setShippingDestination(orderParams.destinationOption)
        await ordersPage.setShipDate(orderParams.shipDate)
        await ordersPage.goNextStep()
        await ordersPage.waitForNextStep(5)
        await ordersPage.goNextStep()
        await ordersPage.issuePO()
        await page.waitForNavigation({
            url: (url) => url.toString().includes(orderParams.orderOverviewEndpoint),
        })
        await expect(page.url()).toContain(orderParams.orderOverviewEndpoint)
    })
})
