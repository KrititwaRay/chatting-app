import { check } from "express-validator";

export class UserMiddleware {

    loginValidationRule() {
        return [
            check('email')
                .notEmpty().withMessage('Email is required')
                .isEmail().withMessage('Invalid email format'),
        ];
    }
}



