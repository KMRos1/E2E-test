const { faker } = require('@faker-js/faker')

export class TestData {
    name: string
    id: string
    comment: string
    commentWithFiles: string = 'Here is my comment with files'
    specToLink: string = 'Spec-Name-2cdfe706-81a9-4fcc-8a0c-9be5f58f3e1e'
    overviewEndpoint: string = '/comments'
    commentButtonTitle: string = 'Write something to add a comment'

    constructor(entity: string) {
        this.name = faker.fake(`${entity}-Name-{{datatype.uuid}}`)
        this.id = faker.fake(`${entity}-Id-{{datatype.uuid}}`)
        this.comment = `Here is my comment on this beautifull ${entity} `
    }
}
