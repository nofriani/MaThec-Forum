const CategoryQuestioner = require('@models').CategoryQuestioner;
const LinkertScore = require('@models').LinkertScore;
const Questioner = require('@models').Questioner;
const Linkert = require('@models').LinkertScore;
class QuestionerController {
  static async getAllQuestioner(req, res) {
    try {
      const data = await CategoryQuestioner.findAll({
        include: [Questioner],
      });

      if (!data) {
        return res.status(404).json({
          success: false,
          message: 'Data not found',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Success',
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  }

  static async answerQuestioner(req, res) {
    const { questioner } = req.body;

    if (!questioner) {
      return res.status(404).json({
        message: 'Masukan semua',
      });
    }

    await LinkertScore.bulkCreate(questioner);

    return res.status(201).json({
      message: 'Berhasil ditambah',
    });
  }

  static async checkRespondenLinkert(req, res) {
    const { id } = req.params;
    try {
      const userResponseLinkert = await Linkert.findOne({
        where: { id_user: id },
      });

      if (!userResponseLinkert) {
        return res.status(200).json({
          success: true,
          isResponden: false,
          status: 'Success',
          message: 'User belum pernah mengisi kuesioner',
        });
      }
      return res.status(200).json({
        success: true,
        isResponden: true,
        status: 'success',
        message: 'User sudah pernah mengisi kuesioner',
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        status: 'Error',
        message: 'Internal Server Error',
      });
    }
  }
}

module.exports = QuestionerController;
