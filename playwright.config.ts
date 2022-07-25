import { PlaywrightTestConfig } from '@playwright/test'
import { UrlConfig } from './utils/url-config'
UrlConfig.set()

const config: PlaywrightTestConfig = {
    timeout: 180000,
    forbidOnly: !!process.env.CI,
    testDir: 'specs',
    use: {
        actionTimeout: 30000,
        headless: !!process.env.CI,
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
        video: 'on',
        trace: 'retain-on-failure',
    },
}
export default config
