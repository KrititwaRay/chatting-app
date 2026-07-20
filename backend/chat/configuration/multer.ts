import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary";

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
        folder: "chat-images",
        allowed_formats: [
            "jpg",
            "jpeg",
            "png",
            "webp",
            "gif",
            "mp4",
            "mov",
            "avi",
            "mkv",
            "webm",
        ],
        transformation: file.mimetype.startsWith("image/")
            ? [
                {
                    width: 1000,
                    height: 1000,
                    crop: "limit",
                    quality: "auto",
                    fetch_format: "auto",
                },
            ]
            : [
                {
                    width: 1280,
                    height: 720,
                    crop: "limit",
                    quality: "auto",
                    video_codec: "auto",
                },
            ],

    }),
});

export const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
            "video/mp4",
            "video/quicktime", // mov
            "video/x-msvideo", // avi
            "video/x-matroska", // mkv
            "video/webm",
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only images and videos are allowed"));
        }
    }
})