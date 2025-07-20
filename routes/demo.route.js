const express = require('express');
const router = express.Router();
const DemogrammmarController = require('../controllers/demoGrammar.controller');

// 🔹 Bulk testlarni qo‘shish
router.post('/bulk', DemogrammmarController.addBulkTest);

// 🔹 Turi bo‘yicha testlar
router.get('/type/:type', DemogrammmarController.getByType);

// 🔹 CRUD marshrutlar
router.post('/', DemogrammmarController.create);
router.get('/', DemogrammmarController.getAll);
router.get('/:id', DemogrammmarController.getById);
router.put('/:id', DemogrammmarController.update);
router.delete('/:id', DemogrammmarController.delete);

module.exports = router;
