import path from 'node:path'

export class ImageFile {
    name: string
    patch: string

    constructor(name: string) {
        this.name = name
        this.patch = path.resolve(`${__dirname}/${this.name}`)
    }
}
