export class ReadUserPassDto {
    id: number;
    name: string;
    email: string;
    password?: string;
    roleId: number;
    createdAt: Date;
    updatedAt: Date;
    lastAccessAt: Date;
}