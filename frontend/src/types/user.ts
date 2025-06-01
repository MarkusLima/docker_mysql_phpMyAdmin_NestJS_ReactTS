export interface User {
    id: number;
    name: string;
    email: string;
    roleId: number;
}

export interface ReadUser {
    id: number;
    name: string;
    email: string;
    lastAccessAt: string;
    roleId: number
}
