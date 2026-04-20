export class UserService {
    constructor() { }

    signupService = async (reqBody: any): Promise<any> => {
        try {

            return global.Helpers.successFromService("User registered successfully.", {
                name: ""
            })
        } catch (error) {
            return global.Helpers.errorFromService("Something went wrong, please try again later.")

        }
    }

}