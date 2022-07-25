import { test, expect } from '@playwright/test'
import { DesignPage } from '../page-objects/design.page'
import { LogInOutPage } from '../page-objects/log-in-out.page'
import { User } from '../data/user.data'
import { CollaborationPage } from '../page-objects/collaboration.page'
import { CommentsPage } from '../page-objects/comments.page'
import { ImageFile } from '../data/images.data'
import { TestData } from '../data/testData.data'
import { collabolator } from '../data/collabolators.data'

test.describe('Testing design creations', async () => {
    const newUser: User = new User()
    const designData: TestData = new TestData('Design')
    const jpgImage1: ImageFile = new ImageFile('/images/Image1.jpg')
    const jpgImage2: ImageFile = new ImageFile('/images/Image2.jpg')
    let logInPage: LogInOutPage
    let designPage: DesignPage
    let collaborationPage: CollaborationPage
    let commentsPage: CommentsPage

    const testData = {
        designPart1Name: 'Outside',
        designPart2Name: 'Inside',
    }

    test.beforeEach(async ({ page }) => {
        commentsPage = new CommentsPage(page)
        logInPage = new LogInOutPage(page)
        designPage = new DesignPage(page)
        collaborationPage = new CollaborationPage(page)

        await logInPage.load()
        await logInPage.login(newUser.email, newUser.password)
    })

    test('Add and approve design with 2 design parts', async ({ page }) => {
        await test.step('', async () => {
            await designPage.visit()
            await designPage.createDesign(designData.name, designData.id, designData.specToLink, jpgImage1.patch)
            await designPage.clickNextButton(designPage.$.saveButton, designData.overviewEndpoint)
            await designPage.addPart(testData.designPart1Name, jpgImage1.patch)
            await designPage.addPart(testData.designPart2Name, jpgImage2.patch)
            await designPage.lockDesign()
            await designPage.$.designLockedToast.waitFor({ state: 'hidden' })
        })
        await test.step('Add collaborators', async () => {
            await collaborationPage.openCollaboratorModal()
            await collaborationPage.addUser(collabolator.customer.email)
            await collaborationPage.chooseRole(collabolator.permissions.owner, collabolator.customer.userType)
            await collaborationPage.inviteCollaborator()
            await expect(collaborationPage.$.collabolatorTitle(collabolator.customer.title)).toBeVisible()
            await collaborationPage.addUser(collabolator.supplier.email)
            await collaborationPage.chooseRole(collabolator.permissions.editor, collabolator.supplier.userType)
            await collaborationPage.inviteCollaborator()
            await expect(collaborationPage.$.collabolatorTitle(collabolator.supplier.title)).toBeVisible()
            await collaborationPage.$.doneButton.click()
        })
        await test.step('Add comment and images to spec', async () => {
            await expect(commentsPage.$.sendButton).toHaveAttribute('title', designData.commentButtonTitle)
            await commentsPage.addComment(designData.comment)
            await commentsPage.sendComment()
            await commentsPage.addFile(jpgImage1.patch)
            await commentsPage.addFile(jpgImage2.patch)
            await expect(commentsPage.$.sendButton).toHaveAttribute('title', designData.commentButtonTitle)
            await commentsPage.addComment(designData.commentWithFiles)
            await commentsPage.sendComment()
            await expect(commentsPage.$.sendButton).toHaveAttribute('title', designData.commentButtonTitle)
        })
    })
})
