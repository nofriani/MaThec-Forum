const {
  Question,
  Tag,
  QuestionTag,
  User,
  Profile,
  QuestionAnswer,
  sequelize,
  UserAction,
} = require("@models"); // Import model Question
const cheerio = require("cheerio");
const { Op, QueryTypes } = require("sequelize");
class HomeController {
  static async getAll(req, res) {
    try {
      /**
       *   "question_id": "1",
      "uploader": "Novi",
      "profile_picture": "https://i.ibb.co/MZw9H7S/man.png",
      "title": "Adding more columns to MySQL table or implode/?",
      "body": "Using Postgres's LTREE type, I am building a very simple hierarchical tree-like structure of posts and their respective comments. From the design point of view, the posts and comments are identical ...",
      "tags": [
        {
          "tag_name": "database"
        },
        {
          "tag_name": "postgres"
        }
      ],
      "like": 12,
      "dislike": 2,
      "answer_total": 4,
      "viewer_total": 3000,
      "posted_at": "12-02-2023"
    },
       */
      let orderClause = [];
      let whereClause = {};

      if (req.params.keyword) {
        if (req.params.keyword == "hot") {
          orderClause = [["like", "DESC"]];
        } else if (req.params.keyword == "hot_news") {
          orderClause = [["like", "DESC"]];
          const today = new Date();
          const firstDayOfMonth = new Date(
            today.getFullYear(),
            today.getMonth(),
            1,
          );
          const lastDayOfMonth = new Date(
            today.getFullYear(),
            today.getMonth() + 1,
            0,
          );
          const data = await Question.findAll({
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
              },
              {
                model: QuestionAnswer,
              },
            ],
            order: orderClause,
            where: {
              created_at: {
                [Op.between]: [firstDayOfMonth, lastDayOfMonth],
              },
            },
            limit: 5,
          });
          const transformedData = data.map((d) => {
            const $ = cheerio.load(d.body);
            return {
              question_id: d.id,
              uploader: d.User.name,
              profile_picture: d.User.Profile.profile_picture,
              title: d.title,
              body: $.text(),
              tags: d.tag.map((t) => {
                return {
                  tag_name: t.tag_name,
                };
              }),
              like: d.like,
              dislike: d.dislike,
              answer_total: d.QuestionAnswers.length,
              viewer_total: d.view_count,
              vote_count: d.vote_count,
              posted_at: d.createdAt,
            };
          });
          return res.json({
            code: 200,
            success: true,
            message: "Questions Fetched",
            data: transformedData,
          });
        } else if (
          req.params.keyword == "weeks" ||
          req.params.keyword == "month"
        ) {
          if (req.params.keyword == "weeks") {
            const satuMingguLalu = new Date();
            // Menghitung tanggal satu minggu yang lalu
            satuMingguLalu.setDate(satuMingguLalu.getDate() - 7);
            whereClause.created_at = {
              [Op.lt]: new Date(), // Kurang dari tanggal saat ini
              [Op.gte]: satuMingguLalu, // Lebih besar atau sama dengan satu minggu yang lalu
            };
          } else {
            const bulanLalu = new Date();
            // Menghitung tanggal satu minggu yang lalu
            bulanLalu.setDate(bulanLalu.getMonth() - 1);
            whereClause.created_at = {
              [Op.lt]: new Date(), // Kurang dari tanggal saat ini
              [Op.gte]: bulanLalu, // Lebih besar atau sama dengan satu bulan yang lalu
            };
          }
        } else if (req.params.keyword == "all") {
          // Tampilkan semua pertanyaan
          orderClause = [["created_at", "DESC"]];
        } else if (req.params.keyword == "answer") {
          const questionIdsWithAnswers = await QuestionAnswer.findAll({
            attributes: ["question_id"],
          });
          whereClause.id = {
            [Op.in]: questionIdsWithAnswers.map((answer) => answer.question_id),
          };
        } else if (req.params.keyword == "tag_populer") {
          const currentYear = new Date().getFullYear();
          const currentMonth = new Date().getMonth() + 1;
          const popularQuestions = await sequelize.query(
            "SELECT Q.title, Q.body, T.tag_name, COUNT(QT.tag_id) AS tag_count " +
              'FROM "QuestionTags" QT ' +
              'INNER JOIN "Questions" Q ON Q.id = QT.question_id ' +
              'INNER JOIN "Tags" T ON QT.tag_id = T.id ' +
              "WHERE DATE_PART('year', Q.created_at) = :year " +
              "AND DATE_PART('month', Q.created_at) = :month " +
              "GROUP BY Q.title, Q.body, T.tag_name " +
	      "HAVING MAX(Q.deleted_at) IS NULL " +
              "ORDER BY tag_count DESC;",
            {
              type: QueryTypes.SELECT,
              replacements: { year: currentYear, month: currentMonth },
            },
          );
          const transformedData = popularQuestions.map((d) => {
            const $ = cheerio.load(d.body);
            return {
              question_id: d.id,
              title: d.title,
              body: $.text(),
              tag_name: d.tag_name,
              tag_count: d.tag_count,
	      
            };
          });

          return res.json({
            code: 200,
            success: true,
            message: "Questions Fetched",
            data: transformedData,
          });
        } else if (req.params.keyword == "tag_new") {
          const newQuestions = await sequelize.query(
            "SELECT Q.title, Q.body, QT.created_at, T.tag_name " +
            'FROM "Questions" Q ' +
            'INNER JOIN ( ' +
            '    SELECT question_id, tag_id, MAX(created_at) AS created_at ' +
            '    FROM "QuestionTags" ' +
            '    GROUP BY question_id, tag_id ' +
            ') AS latest_tags ON Q.id = latest_tags.question_id ' +
            'INNER JOIN "QuestionTags" QT ' +
            '    ON Q.id = QT.question_id AND latest_tags.tag_id = QT.tag_id AND latest_tags.created_at = QT.created_at ' +
            'INNER JOIN "Tags" T ON QT.tag_id = T.id ' +
            'WHERE Q.deleted_at IS NULL ' +
            'ORDER BY QT.created_at DESC;',
            { type: QueryTypes.SELECT },
          );
          const transformedData = newQuestions.map((d) => {
            const $ = cheerio.load(d.body);
            return {
              question_id: d.id,
              title: d.title,
              body: $.text(),
              tag_name: d.tag_name,
            };
          });

          return res.json({
            code: 200,
            success: true,
            message: "Questions Fetched",
            data: transformedData,
          });
        } else if (req.params.keyword == "tag_long") {
          const newQuestions = await sequelize.query(
	   'SELECT Q.title, Q.body, T.tag_name ' +
           'FROM "Questions" Q '+
           'INNER JOIN "QuestionTags" QT '+
           '     ON Q.id = QT.question_id '+
           'INNER JOIN (' +
           '     SELECT question_id, tag_id, MAX(created_at) AS created_at ' +
           '     FROM "QuestionTags" ' +
           '     GROUP BY question_id, tag_id ' +
           ' ) AS latest_tags ON QT.question_id = latest_tags.question_id AND QT.tag_id = latest_tags.tag_id AND QT.created_at = latest_tags.created_at ' +
           'INNER JOIN "Tags" T ON QT.tag_id = T.id ' +
           'WHERE Q.deleted_at IS NULL ' +
           'ORDER BY latest_tags.created_at ASC;',
            { type: QueryTypes.SELECT },
          );
          const transformedData = newQuestions.map((d) => {
            const $ = cheerio.load(d.body);
            return {
              question_id: d.id,
              title: d.title,
              body: $.text(),
              tag_name: d.tag_name,
            };
          });

          return res.json({
            code: 200,
            success: true,
            message: "Questions Fetched",
            data: transformedData,
          });
        } else if (req.params.keyword == "answer") {
          const data = await Question.findAll({
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
              },
              {
                model: QuestionAnswer,
              },
            ],
            order: orderClause,
            where: whereClause,
          });
          const transformedData = data.map((d) => {
            const $ = cheerio.load(d.body);
            return {
              question_id: d.id,
              uploader: d.User.name,
              profile_picture: d.User.Profile.profile_picture,
              title: d.title,
              body: $.text(),
              tags: d.tag.map((t) => {
                return {
                  tag_name: t.tag_name,
                };
              }),
              like: d.like,
              dislike: d.dislike,
              answer_total: d.QuestionAnswers.length,
              viewer_total: d.view_count,
              vote_count: d.vote_count,
              posted_at: d.createdAt,
            };
          });

          transformedData = transformedData.filter(
            (item) => item.answer_total > 0,
          );
          return res.json({
            code: 200,
            success: true,
            message: "Questions Fetched",
            data: transformedData,
          });
        } else if (req.params.keyword == "no_answer") {
          const data = await Question.findAll({
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
              },
              {
                model: QuestionAnswer,
              },
              {
                model: UserAction,
              },
            ],
            order: orderClause,
            where: whereClause,
          });
          let transformedData = data.map((d) => {
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

          transformedData = transformedData.filter(
            (item) => item.answer_total == 0,
          );

          return res.json({
            code: 200,
            success: true,
            message: "Questions Fetched",
            data: transformedData,
          });
        }
      }
      const data = await Question.findAll({
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
          },
          {
            model: QuestionAnswer,
          },
          {
            model: UserAction,
          },
        ],
        order: orderClause,
        where: whereClause,
      });
      const transformedData = data.map((d) => {
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
        message: "Questions Fetched",
        data: transformedData,
      });
    } catch (err) {
      return res.status(500).json({
        error: err.message,
      });
    }
  }
  static async getMonth(req, res) {
    const { from, to } = req.params;
    const result = await Question.findAll({
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
        },
        {
          model: QuestionAnswer,
        },
        {
          model: UserAction,
        },
      ],
      where: {
        createdAt: {
          [Op.gte]: new Date(from),
          [Op.lte]: new Date(to),
        },
      },
    });
    const transformedData = result.map((d) => {
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

    return res.status(200).json({
      message: "Fetched Questions",
      data: transformedData,
    });
  }
  static async searchAll(req, res) {
    const { search } = req.params;
    const questions = await Question.findAll({
      where: {
        [Op.or]: [
          {
            title: {
              [Op.iLike]: `%${search}%`,
            },
          },
          {
            body: {
              [Op.iLike]: `%${search}%`,
            },
          },
        ],
      },
    });
    const users = await User.findAll({
      where: {
        name: {
          [Op.iLike]: `%${search}%`,
        },
      },
    });
    const tags = await Tag.findAll({
      where: {
        tag_name: {
          [Op.iLike]: `%${search}%`,
        },
      },
    });

    return res.status(200).json({
      message: "The result from search",
      questions,
      users,
      tags,
    });
  }
}

module.exports = HomeController;
