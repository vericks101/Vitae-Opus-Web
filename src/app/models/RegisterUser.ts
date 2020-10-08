export class RegisterUser {
    username: string;
    email: string;
    password: string;
    name: string;

    constructor(username: string, email: string, password: string, firstName: string, lastName: string) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.name = `${firstName} ${lastName}`
    }
}