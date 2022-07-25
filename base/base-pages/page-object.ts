import { BasePageObject, Object$, ParentElement } from './base-page-object'
import { Page } from '@playwright/test'
import { BaseAppUrlGenerator } from '../base-urls/base-app-url-generator'

export abstract class PageObject extends BasePageObject {
    private privateUrl: BaseAppUrlGenerator
    abstract $: Object$

    protected constructor(page: Page, url: BaseAppUrlGenerator, parentElement?: ParentElement) {
        super(page, parentElement)
        this.privateUrl = url
    }

    get url(): string {
        return this.privateUrl.getLocalisedUrl()
    }

    async load(): Promise<PageObject> {
        await this.page.goto(this.url)
        await this.waitForPageLoad()
        return this
    }

    abstract waitForPageLoad(): Promise<void>
}
