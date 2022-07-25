import { test, expect } from '@playwright/test'
import { SpecsPage } from '../page-objects/specs.page'
import { PssFormPage } from '../page-objects/pss-form.page'
import { LogInOutPage } from '../page-objects/log-in-out.page'
import { User } from '../data/user.data'
import { CollaborationPage } from '../page-objects/collaboration.page'
import { CommentsPage } from '../page-objects/comments.page'
import { ImageFile } from '../data/images.data'
import { TestData } from '../data/testData.data'
import { collabolator } from '../data/collabolators.data'

test.describe('Testing spec creation', async () => {
    const newUser: User = new User()
    const specData: TestData = new TestData('Spec')
    const jpgImage1: ImageFile = new ImageFile('/images/Image1.jpg')
    const jpgImage2: ImageFile = new ImageFile('/images/Image2.jpg')
    let logInOutPage: LogInOutPage
    let specsPage: SpecsPage
    let pssFormPage: PssFormPage
    let collaborationPage: CollaborationPage
    let commentsPage: CommentsPage

    const testData = {
        specCreateEndpoint: '/create?type=JSON&step=2',
    }
    const pssData = {
        width: '200',
        depth: '300',
        height: '400',
    }

    test.beforeEach(async ({ page }) => {
        logInOutPage = new LogInOutPage(page)
        commentsPage = new CommentsPage(page)
        specsPage = new SpecsPage(page)
        pssFormPage = new PssFormPage(page)
        collaborationPage = new CollaborationPage(page)

        await logInOutPage.load()
        await logInOutPage.login(newUser.email, newUser.password)
    })

    test('Create specification with comments and collabolators', async ({ page }) => {
        await test.step('Create spec', async () => {
            await specsPage.visit()
            await specsPage.createNewSpecFromScratch()
            await specsPage.fakeSpecParams(specData.name, specData.id)
            await specsPage.clickNextButton(specsPage.$.nextButton, testData.specCreateEndpoint)
            await pssFormPage.fillSizeInputs(pssData.width, pssData.depth, pssData.height)
            await pssFormPage.$.externalOption.click()
            await pssFormPage.$.whiteCheckBox.click()
            await pssFormPage.clickNextButton(pssFormPage.$.saveButton, specData.overviewEndpoint)
            await specsPage.$.unLockedButton.click()
            await specsPage.$.confirmButton.click()
            await expect(specsPage.$.lockedButton).toBeVisible()
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

        await test.step('Add comments with images', async () => {
            await expect(commentsPage.$.sendButton).toHaveAttribute('title', specData.commentButtonTitle)
            await commentsPage.addComment(specData.comment)
            await commentsPage.sendComment()
            await commentsPage.addFile(jpgImage1.patch)
            await commentsPage.addFile(jpgImage2.patch)
            await expect(commentsPage.$.sendButton).toHaveAttribute('title', specData.commentButtonTitle)
            await commentsPage.addComment(specData.commentWithFiles)
            await commentsPage.sendComment()
            await expect(commentsPage.$.sendButton).toHaveAttribute('title', specData.commentButtonTitle)
        })
    })
})
