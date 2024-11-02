const express = require('express');
const router = express.Router();
const recordController = require('../controller/recordController');
const { upload } = require('../middleware/multerConfig'); // Import multer configuration

router.post('/add-record', upload.fields([{ name: 'picture' }, { name: 'salarySlip' }]), recordController.addRecord);
router.get('/all-records', recordController.getAllRecords);
router.delete('/delete-record/:id', recordController.deleteRecord);
router.put('/edit-record/:id', recordController.editRecord);




module.exports = router;
