const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const verify = require("./../../middleware/verify");
const { Report, Question, User, Profile } = require("@models");

router.use(verify);
router.get("/", async (req, res) => {
  const [notifications, questionReport] = await Promise.all([
    Report.findAll({
      where: {
        read: false,
      },
      include: [
        {
          model: User,
          as: "pelapor",
          paranoid: false,
          include: [
            {
              model: Profile,
              as: "Profile",
            },
          ],
        },
      ],
    }),
    Report.findAll({
      include: [
        {
          model: User,
          as: "pelapor",
          paranoid: false,
          attributes: ["name"],
        },
        {
          model: Question,
          as: "question",
          attributes: ["id", "title", "body", "deleted_at"],
          paranoid: false,
        },
      ],
      where: {
        question_id: {
          [Op.not]: null,
        },
      },
    }),
  ]);

  await Report.update(
    {
      read: true,
    },
    {
      where: {
        question_id: {
          [Op.not]: null,
        },
        read: false,
      },
    },
  );

  const nama = "Pengguna";
  res.render("questions", {
    nama,
    title: "Mathec | Question",
    page_name: "questions",
    admin: req.session.admin,
    reports: questionReport,
    notifications,
  });
});

router.get("/delete/:id", async (req, res) => {
  const { id } = req.params;

  await Question.update(
    {
      deleted_at: new Date(),
    },
    {
      where: {
        id,
      },
    },
  );
  res.redirect("/questions");
});

module.exports = router;
