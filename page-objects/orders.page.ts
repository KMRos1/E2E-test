import { Page, Locator } from '@playwright/test'
import { PageObject } from '../base/base-pages/page-object'
import { AppUrl } from '../utils/app-url'

const orderPageUrl = new AppUrl({
    com: 'app/c/orders',
})

export class OrdersPage extends PageObject {
    $ = {
        addOrderButton: this.page.locator('text=Add order'),
        itemSelector: this.page.locator('#id'),
        nextButton: this.page.locator('button:has-text("Next")'),
        supplierSelector: this.page.locator('#supplier'),
        itemSelector2: this.page.locator('#id0'),
        quantity: this.page.locator('input[name="quantity"]'),
        itemOption: (itemOption: string) => this.page.locator(`text=${itemOption}`),
        supplierOption: (supplierOption: string) => this.page.locator(`text=${supplierOption}`).nth(1),
        unitOption: (unitOption: string) => this.page.locator(`text=${unitOption}`).nth(1),
        currencyOption: (currencyOption: string) => this.page.locator(`text=${currencyOption}`).nth(1),
        shippingOption: (shippingOption: string) => this.page.locator(`text=${shippingOption}`),
        destinationOption: (destinationOption: string) => this.page.locator(`text=${destinationOption}`),
        unit: this.page.locator('#unit0'),
        currency: this.page.locator('#currency0'),
        price: this.page.locator('input[name="price"]'),
        shippingMetod: this.page.locator('#shippingMethod'),
        shippingDestination: this.page.locator('#shippingLocation'),
        shipDate: this.page.locator('input[name="targetShippingDate"]'),
        issuePo: this.page.locator('button:has-text("Issue PO")'),
        addMoreItems: this.page.locator('button:has-text("Add more items")'),
        poName: this.page.locator('#name'),
        poId: this.page.locator('#poNumber'),
    }

    constructor(page: Page) {
        super(page, orderPageUrl)
    }

    async waitForPageLoad(): Promise<void> {
        await this.$.addOrderButton.hover()
    }
    async selectItem(item: string): Promise<void> {
        await this.$.itemSelector.click()
        await this.$.itemOption(item).click()
    }
    async selectSupplier(selector: string): Promise<void> {
        await this.$.supplierSelector.click()
        await this.$.supplierOption(selector).click()
    }
    async addItem(item: string, quantity: string, unit: string, currency: string, price: string): Promise<void> {
        await this.$.itemSelector2.click()
        await this.$.itemOption(item).click()
        await this.$.quantity.fill(quantity)
        await this.page.waitForTimeout(500)
        await this.$.unit.click()
        await this.$.unitOption(unit).click()
        await this.$.currency.click()
        await this.$.currencyOption(currency).click()
        await this.$.price.fill(price)
    }
    async setShippingMethod(shipingOption: string): Promise<void> {
        await this.$.shippingMetod.click()
        await this.$.shippingOption(shipingOption).click()
    }
    async setShippingDestination(destinationOption: string): Promise<void> {
        await this.$.shippingDestination.click()
        await this.$.destinationOption(destinationOption).click()
    }
    async setShipDate(date: string): Promise<void> {
        await this.$.shipDate.fill(date)
    }
    async goNextStep(): Promise<void> {
        await this.page.waitForTimeout(500)
        await this.$.nextButton.click()
    }
    async issuePO(): Promise<void> {
        await this.page.waitForTimeout(500)
        await this.$.issuePo.click()
    }
    async fakeOrderParams(name: string, id: string): Promise<void> {
        await this.$.poName.fill(name)
        await this.$.poId.fill(id)
    }
    async waitForNextStep(step: number): Promise<void> {
        await this.page.waitForNavigation({
            url: (url) => url.toString().includes(`step=${step}`),
        })
    }
}
