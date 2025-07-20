const DemogrammmarService = require('../service/demoGrammar.service');

// Ruxsat etilgan savol turlari
const ALLOWED_TYPES = [
  'multiple-choice',
  'multiple-select',
  'fill-in-the-blank',
  'true-false',
  'drag-and-drop',
  'match-pairs',
  'reorder-sentence',
  'choose-the-correct-form',
  'error-identification',
  'sentence-completion'
];

// Qaysi turlar uchun kamida 2 ta variant bo‘lishi shart
const TYPES_REQUIRING_OPTIONS = [
  'multiple-choice',
  'multiple-select',
  'true-false',
  'drag-and-drop',
  'match-pairs',
  'choose-the-correct-form',
  'error-identification',
  'sentence-completion',
  'reorder-sentence'
];

class DemogrammmarController {
  // 🔹 POST /api/demo - Yangi savol yaratish
  async create(req, res) {
    try {
      const { question, options, correct_answer, type } = req.body;

      if (!question || !correct_answer || !type) {
        return res.status(400).json({ message: 'Majburiy maydonlar: question, correct_answer, type' });
      }

      if (TYPES_REQUIRING_OPTIONS.includes(type)) {
        if (!Array.isArray(options) || options.length < 2) {
          return res.status(400).json({ message: 'Kamida 2 ta variant bo‘lishi kerak' });
        }
      }

      if (!ALLOWED_TYPES.includes(type)) {
        return res.status(400).json({ message: 'Noto‘g‘ri test turi' });
      }

      const questionData = await DemogrammmarService.createQuestion(req.body);
      res.status(201).json(questionData);
    } catch (error) {
      res.status(500).json({
        message: 'Savol yaratishda xatolik yuz berdi',
        error: error.message
      });
    }
  }

  // 🔹 GET /api/demo - Barcha savollarni olish (pagination optional)
  async getAll(req, res) {
    try {
      const { page = 1, limit = 50 } = req.query;
      const questions = await DemogrammmarService.getAllQuestions(parseInt(page), parseInt(limit));
      res.status(200).json(questions);
    } catch (error) {
      res.status(500).json({
        message: 'Savollarni olishda xatolik',
        error: error.message
      });
    }
  }

  // 🔹 GET /api/demo/:id - ID orqali savolni olish
  async getById(req, res) {
    try {
      const question = await DemogrammmarService.getQuestionById(req.params.id);
      if (!question) {
        return res.status(404).json({ message: 'Savol topilmadi' });
      }
      res.status(200).json(question);
    } catch (error) {
      res.status(500).json({
        message: 'Savolni olishda xatolik',
        error: error.message
      });
    }
  }

  // 🔹 PUT /api/demo/:id - Savolni yangilash
  async update(req, res) {
    try {
      const { options, type } = req.body;

      if (type && !ALLOWED_TYPES.includes(type)) {
        return res.status(400).json({ message: 'Noto‘g‘ri test turi' });
      }

      if (type && TYPES_REQUIRING_OPTIONS.includes(type)) {
        if (!Array.isArray(options) || options.length < 2) {
          return res.status(400).json({ message: 'Kamida 2 ta variant bo‘lishi kerak' });
        }
      }

      const updated = await DemogrammmarService.updateQuestion(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ message: 'Yangilash uchun savol topilmadi yoki o‘zgartirish kiritilmadi' });
      }
      res.status(200).json({ message: 'Savol yangilandi', data: updated });
    } catch (error) {
      res.status(400).json({
        message: 'Savolni yangilashda xatolik',
        error: error.message
      });
    }
  }

  // 🔹 DELETE /api/demo/:id - Savolni o‘chirish
  async delete(req, res) {
    try {
      const deleted = await DemogrammmarService.deleteQuestion(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: 'O‘chirish uchun savol topilmadi' });
      }
      res.status(200).json({ message: 'Savol muvaffaqiyatli o‘chirildi' });
    } catch (error) {
      res.status(500).json({
        message: 'Savolni o‘chirishda xatolik',
        error: error.message
      });
    }
  }

  // 🔹 GET /api/demo/type/:type - Test turi bo‘yicha savollarni olish
  async getByType(req, res) {
    try {
      const { type } = req.params;

      if (!ALLOWED_TYPES.includes(type)) {
        return res.status(400).json({ message: 'Noto‘g‘ri test turi' });
      }

      const questions = await DemogrammmarService.getByType(type);
      res.status(200).json(questions);
    } catch (error) {
      res.status(500).json({
        message: 'Berilgan turdagi savollarni olishda xatolik',
        error: error.message
      });
    }
  }

  // 🔹 POST /api/demo/bulk - Bir nechta testlarni bulk qo‘shish
  async addBulkTest(req, res) {
    try {
      const grammarList = req.body;

      if (!Array.isArray(grammarList) || grammarList.length === 0) {
        return res.status(400).json({ message: 'Iltimos, kamida bitta savol yuboring' });
      }

      for (const item of grammarList) {
        if (!item.question || !item.correct_answer || !item.type) {
          return res.status(400).json({ message: 'Har bir savolda question, correct_answer, va type bo‘lishi kerak' });
        }

        if (!ALLOWED_TYPES.includes(item.type)) {
          return res.status(400).json({ message: `Noto‘g‘ri test turi: ${item.type}` });
        }

        if (TYPES_REQUIRING_OPTIONS.includes(item.type)) {
          if (!Array.isArray(item.options) || item.options.length < 2) {
            return res.status(400).json({ message: 'Har bir savolda kamida 2 ta variant bo‘lishi kerak' });
          }
        }
      }

      const inserted = await DemogrammmarService.addBulkTest(grammarList);

      res.status(201).json({
        message: 'Bulk savollar muvaffaqiyatli qo‘shildi',
        count: inserted.length,
        data: inserted
      });
    } catch (error) {
      res.status(500).json({
        message: 'Bulk savollarni qo‘shishda xatolik',
        error: error.message
      });
    }
  }
}

module.exports = new DemogrammmarController();
