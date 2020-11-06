import { Tag } from 'src/app/models/Tag';

export class Experience {
    username: string;
    title: string;
    description: string;
    tags: Tag[];
    updatedTitle: string;
    updatedDescription: string;
    updatedTags: Tag[];
    oldTitle: string;
}