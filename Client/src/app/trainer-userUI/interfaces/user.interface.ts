export interface User {
    confirmed: boolean;
    _id:       string;
    email:     string;
    names:     string;
    password:  string;
    role:      Role;
    flow:      string;
    createdAt: Date;
    updatedAt: Date;
    __v:       number;
}

export interface Role {
    _id:       string;
    name:      string;
    createdAt: Date;
    updatedAt: Date;
    __v:       number;
}
