import { check } from "express-validator";

export class ChatMiddleware {

    createNewChatRule() {
        return [
            check("otherUserId")
                .trim()
                .notEmpty()
                .withMessage("Other user ID is required")
                .isMongoId()
                .withMessage("Please provide a valid user ID"),


        ];
    }
}

