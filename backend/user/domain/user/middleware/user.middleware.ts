import { check } from "express-validator";

export class UserMiddleware {

    loginValidationRule() {
        return [
            check('email')
                .notEmpty().withMessage('Email is required')
                .isEmail().withMessage('Invalid email format'),
        ];
    }
    verifyUserRule() {
        return [
            check('email')
                .notEmpty().withMessage('Email is required')
                .isEmail().withMessage('Invalid email format'),
            check('otp')
                .notEmpty().withMessage('OTP is required')
                .isLength({ min: 6, max: 6 }).withMessage('OTP must be exactly 6 digits')
                .isNumeric().withMessage('OTP must contain only digits')
        ];
    }

    updateProfileRule() {
        return [
            check('name')
                .notEmpty().withMessage('Name is required')
                .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters')
                .trim()
                .escape()
        ];
    }
}



