
const {
  Question,
  QuestionTag,
  User,
  Tag,
  UserAction,
  Profile,
  QuestionAnswer,
  ActionAnswer,
} = require("@models"); // Import model Question
const bodyParser = require("body-parser");
const uploadImageFromBase64 = require("../utils/uploadImageFromBase64");

class QuestionController {
  static async getTagId(request, data) {
    let idTags = [];
    // Buat array request menjadi lowercase.
    request = request.map((r) => r.toLowerCase());

    data.forEach((d) => {
      if (request.includes(d.tag_name.toLowerCase())) {
        idTags.push(d.id);
      }
    });

    // Buat array untuk menyimpan tag yang tidak ada di database.
    let missingTags = [];

    // Periksa apakah setiap tag dalam request ada di database.
    request.forEach(async (r) => {
      if (!data.some((d) => d.tag_name.toLowerCase() === r.toLowerCase())) {
        missingTags.push(r);
      }
    });

    // Buat tag baru untuk setiap tag yang hilang di database.
    if (missingTags.length > 0) {
      const newTags = await Tag.bulkCreate(
        missingTags.map((r) => ({ tag_name: r })),
        { fields: ["tag_name"] },
      );

      // Tambahkan ID tag baru ke array idTags.
      newTags.forEach((t) => {
        idTags.push(t.id);
      });
    }

    // Return array idTags.
    return idTags;
  }
  static async addQuestionAnswer(req, res) {
    await QuestionAnswer.create({
      question_id: req.body.question_id,
      user_id: req.body.user_id,
      body: req.body.body,
    });

    const question = await Question.findByPk(req.body.question_id);
    question.answer_total++;
    await question.save();

    return res.json({
      code: 201,
      success: true,
      message: "Answered",
    });
  }
  static async getQuestionById(req, res) {
    try {
      const id = req.params.id;
      const data = await Question.findOne({
        where: {
          id,
        },
        attributes: [
          "id",
          "title",
          "body",
          "like",
          "dislike",
          "view_count",
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
        ],
      });

      let orderClause = [];
      if (req.params.keyword == "hot") {
        orderClause = [["like_count", "DESC"]];
      } else if (req.params.keyword == "new") {
        orderClause = [["createdAt", "DESC"]];
      } else if (req.params.keyword == "long") {
        orderClause = [["createdAt", "ASC"]];
      } else if (req.params.keyword == "all") {
      }

      const answers = await QuestionAnswer.findAll({
        where: {
          question_id: id,
        },
        include: [
          {
            model: User,
            attributes: ["name"],
            paranoid: false,
            include: [
              {
                model: Profile,
              },
            ],
          },
        ],
        order: orderClause,
      });

      const transformedData = {
        question: {
          question_id: data.id,
          uploader: data.User.name,
          profile_picture: data.User.Profile.profile_picture,
          title: data.title,
          body: data.body,
          tags: data.tag.map((t) => {
            return {
              tag_name: t.tag_name,
            };
          }),
          like: data.like,
          dislike: data.dislike,
          answer_total: 0,
          viewer_total: data.view_count,
          posted_at: data.createdAt,
        },
        answers: answers,
      };

      return res.json({
        code: 200,
        success: true,
        message: "Question Fetched",
        data: transformedData,
      });
    } catch (err) {
      return res.status(500).json({
        error: err.message,
      });
    }
  }
  // Post question
  static async addQuestionByUserId(req, res) {
    const { user_id, title, body, tags } = req.body;
    try {
      const html = await uploadImageFromBase64.upload(body);
      const tag_list = await Tag.findAll({});
      const getIds = await QuestionController.getTagId(tags, tag_list);

      const question = await Question.create({
        user_id,
        title,
        body: html,
        like: 0,
        dislike: 0,
        view_count: 0,
        vote_count: 0,
      });
      // Insert array getIds ke tabel QuestionTags
      try {
        for (let i = 0; i < getIds.length; i++) {
          await QuestionTag.create({
            question_id: question.id,
            tag_id: getIds[i],
          });
        }
        return res.json({
          code: 201,
          success: true,
          message: "Question Added",
        });
      } catch (err) {
        return res.status(500).json({
          error: err.message,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async updateQuestionById(req, res) {
    const { title, tags, body } = req.body;
    const { id } = req.params;

    try {
      //const bodyHtml = body.toString();
      const html = await uploadImageFromBase64.upload(body);
      const tag_list = await Tag.findAll({});
      const getIds = await QuestionController.getTagId(tags, tag_list);
      const findQuestion = await Question.findOne({ where: { id } });
      if (!findQuestion) {
        return res.status(404).json({
          success: false,
          message: "Data Question Not Found",
        });
      }

      const dataUpdate = await Question.update(
        {
          title,
          body: html,
        },
        {
          where: { id },
        },
      );
      try {

      const existingTags = await QuestionTag.findAll({ where: { question_id: findQuestion.id } });
      const existingTagIds = existingTags.map(tag => tag.tag_id);
      const tagsToDelete = existingTagIds.filter(tagId => !getIds.includes(tagId));
      await QuestionTag.destroy({ where: { question_id: findQuestion.id, tag_id: tagsToDelete } });

        for (let i = 0; i < getIds.length; i++) {
	  await QuestionTag.findOrCreate({
            where: {
              question_id: findQuestion.id,
              tag_id: getIds[i],
            },
            defaults: {
              question_id: findQuestion.id,
              tag_id: getIds[i],
            },
          });
        }
        return res.json({
          code: 201,
          success: true,
          message: "Question Updated",
	  data: dataUpdate,
        });
      } catch (err) {
        return res.status(500).json({
          error: err.message,
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        status: "Internal Server Error",
        message: error.message,
	body: body,
      });
    }
  }

  static async likeQuestionById(req, res) {
    const { question_id, user_id } = req.body;

    const question = await Question.findByPk(question_id);
    if (!question) {
      res.status(500).json({
        code: 500,
        success: false,
        message: "The questions is not found",
      });
    }

    const action = await UserAction.findOne({
      where: { question_id, user_id, type_judge: "like" },
    });
    const judgeIsExist = await UserAction.findOne({
      where: { question_id, user_id, type_judge: "dislike" },
    });

    if (action) {
      question.like--;
      await question.save();
      await UserAction.destroy({
        where: {
          id: action.id,
        },
      });
      res.status(201).json({
        code: 201,
        success: true,
        message: "Questions like cancel",
        data: question,
      });
    } else {
      await UserAction.create({
        question_id,
        user_id,
        type_judge: "like",
      });
      if (judgeIsExist) {
        await UserAction.destroy({ where: { id: judgeIsExist.id } });
        question.dislike--;
      }
      question.like++;
      await question.save();
      res.status(201).json({
        code: 201,
        success: true,
        message: "Questions liked",
        data: question,
      });
    }
  }

  static async disLikeQuestionById(req, res) {
    const { question_id, user_id } = req.body;

    const question = await Question.findByPk(question_id);
    if (!question) {
      res.status(500).json({
        code: 500,
        success: false,
        message: "The questions is not found",
      });
    }

    const action = await UserAction.findOne({
      where: { question_id, user_id, type_judge: "dislike" },
    });
    const judgeIsxist = await UserAction.findOne({
      where: { question_id, user_id, type_judge: "like" },
    });
    if (action) {
      question.dislike--;
      await question.save();
      await UserAction.destroy({ where: { id: action.id } });
      res.status(201).json({
        code: 201,
        success: true,
        message: "Questions dislike cancel",
        data: question,
      });
    } else {
      await UserAction.create({
        question_id,
        user_id,
        type_judge: "dislike",
      });
      if (judgeIsxist) {
        await UserAction.destroy({ where: { id: judgeIsxist.id } });
        question.like--;
      }
      question.dislike++;
      await question.save();
      res.status(201).json({
        code: 201,
        success: true,
        message: "Questions disliked",
        data: question,
      });
    }
  }
  static async savedQuestionById(req, res) {
    const { question_id, user_id } = req.body;

    const question = await Question.findByPk(question_id);
    if (!question) {
      res.status(500).json({
        code: 500,
        success: false,
        message: "The questions is not found",
      });
    }

    const action = await UserAction.findOne({
      where: { question_id, user_id, type_judge: "saved" },
    });
    if (action) {
      question.vote_count--;
      await question.save();
      await UserAction.destroy({ where: { id: action.id } });
      res.status(201).json({
        code: 201,
        success: true,
        message: "Questions saved cancel",
        data: question,
      });
    } else {
      await UserAction.create({
        question_id,
        user_id,
        type_judge: "saved",
      });
      question.vote_count++;
      await question.save();
      res.status(201).json({
        code: 201,
        success: true,
        message: "Questions saved",
        data: question,
      });
    }
  }

  static async addViewQuestions(req, res) {
    const { id } = req.params;

    const question = await Question.findByPk(id);
    question.view_count++;
    await question.save();

    return res.status(200).json({
      message: "view question has been add",
    });
  }

  static async deleteQuestion(req, res) {
    const { id } = req.params;

    await Question.destroy({
      where: { id },
    });

    return res.status(200).json({
      message: "Questions has deleted",
    });
  }

  static async addLikeAnswer(req, res) {
    const { user_id, answer_id } = req.body;
    const existLike = await ActionAnswer.findOne({
      where: {
        user_id: user_id,
        answer_id,
        type: "like",
      },
    });

    const existDisike = await ActionAnswer.findOne({
      where: {
        user_id: user_id,
        answer_id,
        type: "dislike",
      },
    });

    if (existLike) {
      return res.status(200).json({
        message: "You have been like",
      });
    }

    try {
      if (existDisike) {
        await ActionAnswer.destroy({
          where: {
            id: existDisike.id,
          },
        });
        const qw = await QuestionAnswer.findByPk(answer_id);
        const sebelum = qw.like_count;
        qw.like_count++;
        await qw.save();
      } else {
        const qw = await QuestionAnswer.findByPk(answer_id);
        const sebelum = qw.like_count;
        qw.like_count++;
        await qw.save();
        if (sebelum < qw.like_count) {
          const data = await ActionAnswer.create({
            user_id: user_id,
            answer_id: answer_id,
            type: "like",
          });
        }
      }
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }

    return res.status(200).json({
      message: "Success to like",
    });
  }

  static async minusLikeAnswer(req, res) {
    const { user_id, answer_id } = req.body;

    const existLike = await ActionAnswer.findOne({
      where: {
        user_id: user_id,
        answer_id,
        type: "like",
      },
    });

    const existDisike = await ActionAnswer.findOne({
      where: {
        user_id: user_id,
        answer_id,
        type: "dislike",
      },
    });

    if (existDisike) {
      return res.status(200).json({
        message: "You have been like",
      });
    }

    if (existLike) {
      await ActionAnswer.destroy({ where: { id: existLike.id } });
      const qw = await QuestionAnswer.findByPk(answer_id);
      const sebelum = qw.like_count;
      qw.like_count--;
      await qw.save();
    } else {
      const qw = await QuestionAnswer.findByPk(answer_id);
      const sebelum = qw.like_count;
      qw.like_count--;
      await qw.save();

      const data = await ActionAnswer.create({
        user_id: user_id,
        answer_id: answer_id,
        type: "dislike",
      });
    }

    return res.status(200).json({
      message: "yet like this answer",
    });
  }

  static async getAnswerById(req, res) {
    const { id } = req.params;
    try {
      const answerId = await QuestionAnswer.findByPk(id);
      return res.status(200).json({
        success: true,
        message: "Fetch data answer success",
        data: answerId,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  static async updateAnswer(req, res) {
    const { id } = req.params;
    const { body } = req.body;
    try {
      const html = await uploadImageFromBase64.upload(body);
      await QuestionAnswer.update(
        {
          body: html,
        },
        { where: { id } },
      );

      return res.status(200).json({
        success: true,
        message: "Data answer success updated",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  static async deleteAnswer(req, res) {
    const { id } = req.params;
    try {
      await QuestionAnswer.destroy({ where: { id } });
      return res.status(200).json({
        success: true,
        message: "Delete answer success",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}

module.exports = QuestionController;
