import { BaseAppUrlGenerator } from "../base/base-urls/base-app-url-generator";
import { UrlConfig } from "./url-config";

interface LinkParams {
  com: string;
}
export class AppUrl implements BaseAppUrlGenerator {
  com: string;

  constructor(params: LinkParams) {
    this.com = params.com;
  }

  getLocalisedUrl() {
    return `${UrlConfig.get().url}/${this.com}`;
  }

  getUrlTail() {
    return "";
  }
}
