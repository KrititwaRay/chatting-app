import { check, param } from "express-validator";

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

    sendMessageRule() {
        return [
            check("chatId")
                .trim()
                .notEmpty()
                .withMessage("Chat ID is required")
                .isMongoId()
                .withMessage("Please provide a valid chat ID"),
            check("text")
                .trim()
                .notEmpty()
                .withMessage("Message text is required")
                .isLength({ min: 1, max: 5000 })
                .withMessage("Message length must be between 1 and 5000 characters"),

            check("media")
                .custom((value, { req }) => {

                    const files = req.files as Express.Multer.File[];
                    console.log(files)

                    if (!files || files.length === 0) {
                        return true; // media is optional
                    }

                    const allowedTypes = [
                        // Images
                        "image/jpeg",
                        "image/png",
                        "image/webp",
                        "image/gif",

                        // Videos
                        "video/mp4",
                        "video/quicktime",
                        "video/webm",

                        // Documents
                        "application/pdf",
                        "application/msword",
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

                        // Text files
                        "text/plain",

                        // Zip
                        "application/zip",
                    ];

                    for (const file of files) {

                        if (!allowedTypes.includes(file.mimetype)) {
                            throw new Error(
                                `${file.originalname} is not supported`
                            );
                        }

                        if (file.size > 50 * 1024 * 1024) {
                            throw new Error(
                                `${file.originalname} size should be less than 50MB`
                            );
                        }
                    }

                    return true;
                }),
        ]
    }

    getMessagesByChatRule(){
        return [
            param("chatId")
                .notEmpty()
                .withMessage("Chat ID is required")
                .isMongoId()
                .withMessage("Invalid chat ID format")
        ]
    }

}

