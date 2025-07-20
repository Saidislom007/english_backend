const Demogrammmar = require('../models/demo.model');

class DemogrammmarService {
  // 🔹 Yangi savol yaratish
  async createQuestion(data) {
    const question = new Demogrammmar(data);
    return await question.save();
  }

  // 🔹 Barcha savollarni olish (filter, pagination, sort qo‘shilgan)
  async getAllQuestions(page = 1, limit = 50, filter = {}) {
    const skip = (page - 1) * limit;
    const total = await Demogrammmar.countDocuments(filter);
    const data = await Demogrammmar.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return {
      total,
      page,
      pageSize: limit,
      data
    };
  }

  // 🔹 Bitta savolni ID orqali olish
  async getQuestionById(id) {
    return await Demogrammmar.findById(id);
  }

  // 🔹 Savolni yangilash
  async updateQuestion(id, updates) {
    return await Demogrammmar.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });
  }

  // 🔹 Savolni o‘chirish
  async deleteQuestion(id) {
    return await Demogrammmar.findByIdAndDelete(id);
  }

  // 🔹 Test turi bo‘yicha savollar
  async getByType(type) {
    return await Demogrammmar.find({ type }).sort({ createdAt: -1 });
  }

  // 🔹 Bir nechta savollarni bulk tarzda qo‘shish
  async addBulkTest(grammarList) {
    try {
      return await Demogrammmar.insertMany(grammarList, {
        ordered: false, // Bitta xato qolganlarini to‘xtatmasin
        rawResult: false
      });
    } catch (error) {
      throw new Error('Bulk qo‘shishda xatolik: ' + error.message);
    }
  }
}

module.exports = new DemogrammmarService();
