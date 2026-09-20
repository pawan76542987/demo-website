import express from 'express';
import { upload } from '../middleware/upload.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @desc    Upload single image
// @route   POST /api/upload
// @access  Private (Seller)
router.post('/', protect, authorize('seller'), upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
  }

  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  res.status(200).json({
    success: true,
    message: 'Image uploaded successfully',
    url: fileUrl,
    filename: req.file.filename
  });
});

export default router;
