const router = require('express').Router();
const multer = require('multer');
const Issue = require('../models/Issue');
const auth = require('../middleware/auth');
const cloudinary = require('../utils/cloudinary');
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024, files: 3 } });
const User = require('../models/User');
const { sendMail } = require('../utils/mailer');

// Create issue
router.post('/', auth(), upload.array('images', 3), async (req, res) => {
  try {
    const { title, description, category, lng, lat, address } = req.body;
    const uploads = [];
    for (const file of req.files || []) {
      const uploaded = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: 'issues' }, (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
        stream.end(file.buffer);
      });
      uploads.push({ url: uploaded.secure_url, publicId: uploaded.public_id, width: uploaded.width, height: uploaded.height });
    }
    const issue = await Issue.create({
      title, description, category,
      images: uploads,
      location: { type: 'Point', coordinates: [Number(lng) || 0, Number(lat) || 0], address },
      reporter: req.user._id,
      history: [{ status: 'Pending', note: 'Reported', changedBy: req.user._id }]
    });
    res.status(201).json(issue);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error creating issue' });
  }
});

// List issues
// List issues (paginated)
router.get('/', async (req, res) => {
    try {
      const { status, category, page = 1, limit = 20 } = req.query;
      const filter = {};
      if (status) filter.status = status;
      if (category) filter.category = category;
  
      const p = Math.max(1, Number(page));
      const l = Math.min(50, Math.max(1, Number(limit)));
  
      const [items, total] = await Promise.all([
        Issue.find(filter).sort({ createdAt: -1 }).skip((p - 1) * l).limit(l),
        Issue.countDocuments(filter),
      ]);
  
      res.json({
        items,
        page: p,
        limit: l,
        total,
        hasMore: p * l < total,
      });
    } catch (e) {
      res.status(500).json({ message: 'Error fetching issues' });
    }
  });

// Get one
router.get('/:id', async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Not found' });
    res.json(issue);
  } catch (e) { res.status(500).json({ message: 'Error' }); }
});

// Update status
router.post('/:id/status', auth(['official','admin']), async (req, res) => {
    try {
      const { status, note } = req.body;
      const issue = await Issue.findById(req.params.id);
      if (!issue) return res.status(404).json({ message: 'Not found' });
  
      issue.status = status;
      issue.history.push({ status, note, changedBy: req.user._id, changedAt: new Date() });
      await issue.save();
  
      // Notify reporter
      if (issue.reporter) {
        const reporter = await User.findById(issue.reporter);
        if (reporter?.email) {
          const subj = `Your issue "${issue.title || issue._id}" is now ${status}`;
          const body = `Hello ${reporter.name || ''},
  
  The status of your reported issue "${issue.title || issue._id}" has been updated to: ${status}.
  ${note ? `Note: ${note}\n` : ''}
  
  Thank you for helping improve the community.`;
          sendMail({ to: reporter.email, subject: subj, text: body });
        }
      }
  
      res.json(issue);
    } catch (e) { res.status(500).json({ message: 'Error updating status' }); }
  });

module.exports = router;