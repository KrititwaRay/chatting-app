import { check } from "express-validator";

export class UserMiddleware {

    signupValidationRule() {
        return [
            check('email')
                .notEmpty().withMessage('Email is required')
                .isEmail().withMessage('Invalid email format'),

            check('password')
                .notEmpty().withMessage('Password is required')
                .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

            check('phone')
                .notEmpty().withMessage('Phone number is required')
                .isMobilePhone('any').withMessage('Invalid phone number')
        ];
    }
}

