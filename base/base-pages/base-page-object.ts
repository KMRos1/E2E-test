import { FrameLocator, Locator, Page } from "@playwright/test";

export type ParentElement = Locator | string;

export interface Target {
  target?: string;
  name?: string;
}

type LocatorFunction = (
  ...args: never[]
) => Promise<Locator> | Locator | BasePageObject;
type ElementType =
  | Locator
  | Promise<Locator>
  | LocatorFunction
  | BasePageObject;

export interface Object$ {
  [key: string]: ElementType;
}

type NameSearch = {
  by: "name";
  value: string;
};

type IndexSearch = {
  by: "index";
  value: number;
};

type AttributeSearch = {
  by: "id";
  value: string;
};

export type SearchType = NameSearch | IndexSearch | AttributeSearch;

export class BasePageObject {
  $: Object$; // Place to store page elements
  readonly page: Page;
  private readonly _parentElement: Locator | undefined;

  constructor(page: Page, parentElement?: ParentElement) {
    this.page = page;
    this._parentElement =
      typeof parentElement === "string"
        ? this.createLocator(parentElement)
        : parentElement;
  }

  get parentElement(): Locator {
    if (!this._parentElement) {
      throw Error(
        `No "parentElement" provided in PageObject constructor. Either add it, or use "this.page" instead!`
      );
    }
    return this._parentElement;
  }

  createLocator(selector: string | Target) {
    const selectorParts: string[] = [];
    if (typeof selector === "string") {
      selectorParts.push(selector);
    } else {
      if (selector.target)
        selectorParts.push(`[e2e-target="${selector.target}"]`);
      if (selector.name)
        selectorParts.push(`[e2e-target-name="${selector.name}"]`);
    }
    const stringifiedSelector = selectorParts.join();
    if (this.parentElement) {
      return this.parentElement.locator(stringifiedSelector);
    }
    return this.page.locator(stringifiedSelector);
  }
}
