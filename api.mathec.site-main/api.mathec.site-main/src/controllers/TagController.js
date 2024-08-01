const {
  Tag,
  QuestionTag,
  sequelize,
  Question,
  User,
  Profile,
  QuestionAnswer,
  UserAction,
} = require("@models");
const cheerio = require("cheerio");
const { QueryTypes } = require("sequelize");
class TagController {
  static async populer(req, res) {
    // Mendapatkan daftar tag yang paling sering digunakan
    const popularTags = await sequelize.query(
      "SELECT T.id, T.tag_name, COUNT(QT.tag_id) AS tag_count " +
        'FROM "QuestionTags" QT ' +
	'INNER JOIN "Tags" T ON T.id = QT.tag_id ' +
	'INNER JOIN "Questions" Q ON Q.id = QT.question_id ' +
	"WHERE Q.deleted_at IS NULL " +
        "GROUP BY T.id, T.tag_name " +
        "ORDER BY tag_count DESC" +
        " LIMIT 5;",
      {
        type: QueryTypes.SELECT,
      },
    );

    // popularTags sekarang berisi 10 tag paling populer beserta jumlah penggunaannya
    return res.json({
      code: 200,
      success: true,
      message: "Tag Fetched",
      data: popularTags,
    });
  }

  static async TagByName(req, res) {
    const name = req.params.name;

    const questions = await Question.findAll({
      attributes: [
        "id",
        "title",
        "body",
        "like",
        "dislike",
        "view_count",
        "vote_count",
        "createdAt",
      ],
      include: [
        {
          model: User,
          attributes: ["name"],
          paranoid: false,
          include: [
            {
              model: Profile,
              attributes: ["profile_picture"],
            },
          ],
        },
        {
          model: Tag,
          as: "tag",
          where: {
            tag_name: name,
          },
        },
        {
          model: QuestionAnswer,
        },
        {
          model: UserAction,
        },
      ],
    });

    const transformedData = questions.map((d) => {
      const $ = cheerio.load(d.body);
      return {
        question_id: d.id,
        uploader: d.User.name,
        profile_picture: d.User.Profile.profile_picture,
        title: d.title,
        body: $.text(),
        tags: d.tag
          .map((t) => {
            return {
              tag_name: t.tag_name,
            };
          })
          .sort((a, b) => a.tag_name.localeCompare(b.tag_name)),
        like: d.like,
        dislike: d.dislike,
        answer_total: d.QuestionAnswers.length,
        viewer_total: d.view_count,
        vote_count: d.vote_count,
        posted_at: d.createdAt,
        action: d.UserActions,
      };
    });

    return res.json({
      code: 200,
      success: true,
      message: "Tag Fetched",
      data: transformedData,
    });
  }
}
module.exports = TagController;
