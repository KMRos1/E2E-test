export abstract class BaseAppUrlGenerator {
    abstract getLocalisedUrl(): string
    abstract getUrlTail(): string
}
