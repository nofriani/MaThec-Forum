const User = require('@models').User;
const Profile = require('@models').Profile;
const Question = require('@models').Question;
const QuestionAnswer = require('@models').QuestionAnswer;
const Follow = require('@models').Follow;
//const Report = require('@models').Report;
const cheerio = require('cheerio');

class UserController {
  static async getAllUser(req, res) {
    let orderBy = [];
    try {
      if (req.params.keyword == 'new') {
        orderBy = [['created_at', 'DESC']];
      } else if (req.params.keyword == 'long') {
        orderBy = [['created_at', 'ASC']];
      } else if (req.params.keyword == 'all') {
        orderBy = [['name', 'ASC']];
      }
      const user = await User.findAll({
        include: [Profile, Question],
        order: orderBy,
      });
      if (user == null) {
        return res.status(404).json({
          message: 'Data Not Found',
        });
      }
      return res.status(200).json({
        message: 'success',
        data: user,
      });
    } catch (error) {
      return res.status(500).json({
        status: 'Internal Server error',
        message: error.message,
      });
    }
  }
  static async getUserById(req, res) {
    const { id } = req.params;
    try {
      const profile = await User.findOne({
        where: {
          id,
        },
        include: [
          Profile,
          {
            model: Question,
            include: [{ model: QuestionAnswer }],
          },
          QuestionAnswer,
          {
            model: User,
            as: 'followings',
            include: [Profile],
          },
        ],
      });

      if (!profile) {
        return res.status(404).json({
          message: 'profile not found',
        });
      }

      const transformedData = profile.Questions.map(d => {
        const $ = cheerio.load(d.body);
        return {
          id: d.id,
          user_id: d.user_id,
          title: d.title,
          body: $.text(),
          like: d.like,
          dislike: d.dislike,
          view_count: d.view_count,
          vote_count: d.vote_count,
          createdAt: d.createdAt,
          updatedAt: d.updatedAt,
          question_id: d.id,
          answer_total: d.QuestionAnswers.length,
        };
      });

      const transformedDataAnswer = profile.QuestionAnswers.map(d => {
        const $ = cheerio.load(d.body);
        return {
          id: d.id,
          question_id: d.question_id,
          user_id: d.user_id,
          accepted: d.accepted,
          title: d.title,
          body: $.text(),
          vote_count: d.vote_count,
          createdAt: d.createdAt,
          updatedAt: d.updatedAt,
        };
      });

      const transformedProfile = {
        id: profile.id,
        profile_id: profile.profile_id,
        name: profile.name,
        email: profile.email,
        password: profile.password,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
        Profile: profile.Profile,
        Questions: transformedData,
        answers: transformedDataAnswer,
        followings: profile.followings,
      };

      return res.status(200).json({
        message: 'Success',
        data: transformedProfile,
      });
    } catch (error) {
      return res.status(500).json({
        status: 'Internal server error',
        message: error.message,
      });
    }
  }

  static async editProfile(req, res) {
    const { name, email, address, about_me, link, github_link } = req.body;
    const { id } = req.params;

    try {
      const findUser = await User.findByPk(id);
      const profile = await Profile.findOne({
        where: { id: findUser.profile_id },
      });
      if (!findUser) {
        return res.status(404).json({
          message: 'Data Not Found',
        });
      }

      if (req.file == undefined) {
        const data = await User.update(
          {
            name,
            email,
          },
          { where: { id: findUser.id } }
        );

        const profileUpdate = await Profile.update({ address, about_me, link, github_link }, { where: { id: profile.id } });

        const response = {
          data,
          profileUpdate,
        };

        return res.status(200).json({
          message: 'Success',
          data: response,
        });
      } else {
        await User.update(
          {
            name,
            email,
          },
          { where: { id: findUser.id } }
        );

        await Profile.update(
          {
            address,
            about_me,
            profile_picture: `src/image/${req.file.filename}`,
            link,
            github_link,
          },
          { where: { id: profile.id } }
        );

        return res.status(200).json({
          message: 'Success',
          status: true,
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: 'Internal Server error',
        error: error.message,
      });
    }
  }

  static async followUserByID(req, res) {
    const { follower_id, following_id } = req.body;

    const existFollow = await Follow.findOne({
      where: {
        follower_id: follower_id,
        following_id: following_id,
      },
    });

    if (existFollow) {
      await Follow.destroy({
        where: {
          id: existFollow.id,
        },
      });

      return res.status(200).json({
        message: 'User has unfollow',
      });
    }

    const followed = await Follow.create({
      follower_id: follower_id,
      following_id: following_id,
    });

    if (!followed) {
      res.status(500).json({
        message: 'Internal Server error',
      });
    }

    res.status(201).json({
      message: 'Success to following',
    });
  }

  static async checkFollowed(req, res) {
    const { follower_id, following_id } = req.body;

    const existFollow = await Follow.findOne({
      where: {
        follower_id: follower_id,
        following_id: following_id,
      },
    });

    if (!existFollow) {
      return res.status(200).json({
        statusFollow: false,
        message: 'user has not follow',
      });
    }
    return res.status(200).json({
      statusFollow: true,
      message: 'user has followed',
    });
  }
}

module.exports = UserController;
