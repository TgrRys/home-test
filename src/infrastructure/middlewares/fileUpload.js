/**
 * File Upload Infrastructure
 * 
 * This module provides file upload functionality using multer.
 * It's part of the infrastructure layer in clean architecture.
 */
const multer = require('multer');

// Configure multer storage
const storage = multer.memoryStorage();

/**
 * Create an image upload middleware
 * @param {Object} options - Options for the upload
 * @returns {Function} Multer middleware configured for image uploads
 */
const imageUpload = () => {
    const upload = multer({ 
        storage: storage,
        fileFilter: (req, file, cb) => {
            // Accept only jpeg and png
            if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
                cb(null, true);
            } else {
                // Create a custom error for invalid file format
                const error = new Error('Format Image tidak sesuai');
                error.statusCode = 400;
                error.errorCode = 102;
                cb(error, false);
            }
        } 
    });

    return upload;
};

/**
 * Process a single image upload and handle errors
 * @param {string} fieldName - The name of the file field in the form
 * @returns {Function} Express middleware for handling the upload
 */
const processSingleImageUpload = (fieldName) => {
    const uploader = imageUpload();
    
    return (req, res, next) => {
        uploader.single(fieldName)(req, res, (err) => {
            if (err) {
                // Handle multer errors
                return res.status(err.statusCode || 400).json({
                    status: err.errorCode || 102,
                    message: err.message || 'Error processing file',
                    data: null
                });
            }
            next();
        });
    };
};

module.exports = {
    imageUpload,
    processSingleImageUpload
};
