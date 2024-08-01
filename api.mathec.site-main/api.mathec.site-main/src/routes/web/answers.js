const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const cheerio = require("cheerio");
const verify = require("./../../middleware/verify");
const { Report, QuestionAnswer, User, Profile } = require("@models");

router.use(verify);
router.get("/", async (req, res) => {
  const [notifications, answerReport] = await Promise.all([
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
          model: QuestionAnswer,
          as: "answer",
          attributes: ["id", "title", "body", "deleted_at"],
          paranoid: false,
        },
      ],
      where: {
        answer_id: {
          [Op.not]: null,
        },
      },
    }),
  ]);

  const transformedData = answerReport.map((d) => {
    const $ = cheerio.load(d.answer.body);
    return {
      id: d.id,
      answer_id: d.answer.id,
      answer: $.text(),
      jenis_laporan: d.jenis_laporan,
      deskripsi: d.deskripsi,
      pelapor: d.pelapor.name,
      bukti_laporan: d.bukti_laporan,
      deleted_at: d.answer.deleted_at,
      read: d.read,
    };
  });

  await Report.update(
    {
      read: true,
    },
    {
      where: {
        answer_id: {
          [Op.not]: null,
        },
        read: false,
      },
    },
  );

  const nama = "Pengguna";
  return res.render("answers", {
    nama,
    title: "Mathec | Answer",
    page_name: "answers",
    admin: req.session.admin,
    reports: transformedData,
    notifications,
  });
});

router.get("/delete/:id", async (req, res) => {
  const { id } = req.params;

  await QuestionAnswer.update(
    {
      deleted_at: new Date(),
    },
    {
      where: {
        id,
      },
    },
  );
  res.redirect("/answers");
});
module.exports = router;
