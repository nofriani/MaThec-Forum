const { QueryTypes, Sequelize } = require('sequelize');
const {
  UserAction,
  Question,
  User,
  Profile,
  Tag,
  QuestionAnswer,
} = require('@models');
const cheerio = require('cheerio');

class SaveController {
  static async saveById(req, res) {
    const { id, order } = req.params;

    let orderClause = ['id', 'ASC'];
    if (order == 'long') {
      orderClause = ['createdAt', 'DESC'];
    } else if (order == 'new') {
      orderClause = ['createdAt', 'ASC'];
    }
    const saved = await UserAction.findAll({
      where: {
        user_id: id,
        type_judge: 'saved',
      },
      include: [
        {
          model: Question,
          paranoid: false,
          include: [
            {
              model: User,
              attributes: ['name'],
              paranoid: false,
              include: [
                {
                  model: Profile,
                  attributes: ['profile_picture'],
                },
              ],
            },
            {
              model: Tag,
              as: 'tag',
            },
            {
              model: QuestionAnswer,
            },
            {
              model: UserAction,
            },
          ],
        },
      ],
      order: [orderClause],
    });

    let filtersaved = saved.filter((item) => !item.Question.deleted_at);

    const savedTransform = filtersaved.map((item) => {
      const $ = cheerio.load(item.Question.body);

      return {
        question_id: item.question_id,
        uploader: item.Question.User.name,
        profile_picture: item.Question.User.Profile.profile_picture,
        title: item.Question.title,
        body: $.text(),
        tags: item.Question.tag,
        like: item.Question.like,
        dislike: item.Question.dislike,
        answer_total: item.Question.QuestionAnswers.length,
        viewer_total: item.Question.view_count,
        vote_count: item.Question.vote_count,
        posted_at: item.Question.createdAt,
        action: item.Question.UserActions,
      };
    });

    return res.json({
      code: 200,
      success: true,
      message: 'Save Fetched',
      data: savedTransform,
    });
  }
}

module.exports = SaveController;
