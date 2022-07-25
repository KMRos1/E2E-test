import { test, expect } from '@playwright/test'
import { LogInOutPage } from '../page-objects/log-in-out.page'
import { User } from '../data/user.data'
import { CollaborationPage } from '../page-objects/collaboration.page'
import { ItemPage } from '../page-objects/item.page'
import { CommentsPage } from '../page-objects/comments.page'
import { ImageFile } from '../data/images.data'
import { TestData } from '../data/testData.data'
import { collabolator } from '../data/collabolators.data'

test.describe.only('Testing item creation', async () => {
    const newUser: User = new User()
    const jpgImage1: ImageFile = new ImageFile('/images/Image1.jpg')
    const jpgImage2: ImageFile = new ImageFile('/images/Image2.jpg')
    const itemData: TestData = new TestData('Item')
    let logInPage: LogInOutPage
    let collaborationPage: CollaborationPage
    let itemPage: ItemPage
    let commentsPage: CommentsPage

    const tagsData = {
        tag1: '#bag',
        tag2: '#cartoon',
    }

    test.beforeEach(async ({ page }) => {
        logInPage = new LogInOutPage(page)
        commentsPage = new CommentsPage(page)
        collaborationPage = new CollaborationPage(page)
        itemPage = new ItemPage(page)

        await logInPage.load()
        await logInPage.login(newUser.email, newUser.password)
    })

    test('Create new item', async ({ page }) => {
        await test.step('This step create item', async () => {
            await itemPage.visit()
            await itemPage.openItemWizard()
            await itemPage.fakeItemParams(itemData.name, itemData.id)
            await itemPage.addTag(tagsData.tag1)
            await itemPage.addTag(tagsData.tag2)
            await itemPage.clickNextButton(itemPage.$.saveButton, itemData.overviewEndpoint)
            await expect(page.url()).toContain(itemData.overviewEndpoint)
            await itemPage.lockItem()
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

        await test.step('Add comment with images', async () => {
            await expect(commentsPage.$.sendButton).toHaveAttribute('title', itemData.commentButtonTitle)
            await commentsPage.addComment(itemData.comment)
            await commentsPage.sendComment()
            await commentsPage.addFile(jpgImage1.patch)
            await commentsPage.addFile(jpgImage2.patch)
            await expect(commentsPage.$.sendButton).toHaveAttribute('title', itemData.commentButtonTitle)
            await commentsPage.addComment(itemData.commentWithFiles)
            await commentsPage.sendComment()
            await expect(commentsPage.$.sendButton).toHaveAttribute('title', itemData.commentButtonTitle)
        })
    })
})
