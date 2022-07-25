export interface UrlConfig {
    // https://blog.packhelp.com:3000/marketing/index.html?user=1
    httpProtocol: 'http' | 'https' // https
    server: string //
    subdomain: string // blog
    secondLevelDomain: string // packhelp
    topLevelDomain: string // com
    port: string // 3000
    locale: string // en
}
