"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `ALTER SEQUENCE "Tags_id_seq" RESTART WITH 1`
    );
    await queryInterface.sequelize.query(`DELETE FROM "Tags"`);
    let tags = [];
    const allTags = [
      {
        id: 1,
        name: "JavaScript",
      },
      {
        id: 2,
        name: "Node.js",
      },
      {
        id: 3,
        name: "React.js",
      },
      {
        id: 4,
        name: "Vue.js",
      },
      {
        id: 5,
        name: "Angular",
      },
      {
        id: 6,
        name: "PHP",
      },
      {
        id: 7,
        name: "Laravel",
      },
      {
        id: 8,
        name: "Symfony",
      },
      {
        id: 9,
        name: "Java",
      },
      {
        id: 10,
        name: "Spring",
      },
      {
        id: 11,
        name: "Python",
      },
      {
        id: 12,
        name: "Django",
      },
      {
        id: 13,
        name: "Flask",
      },
      {
        id: 14,
        name: "Ruby",
      },
      {
        id: 15,
        name: "Ruby on Rails",
      },
      {
        id: 16,
        name: "SQL",
      },
      {
        id: 17,
        name: "NoSQL",
      },
      {
        id: 18,
        name: "MongoDB",
      },
      {
        id: 19,
        name: "Firebase",
      },
      {
        id: 20,
        name: "GraphQL",
      },
      {
        id: 21,
        name: "REST API",
      },
      {
        id: 22,
        name: "OAuth",
      },
      {
        id: 23,
        name: "Git",
      },
      {
        id: 24,
        name: "AWS",
      },
      {
        id: 25,
        name: "Azure",
      },
      {
        id: 26,
        name: "Google Cloud",
      },
      {
        id: 27,
        name: "Docker",
      },
      {
        id: 28,
        name: "Kubernetes",
      },
      {
        id: 29,
        name: "CI/CD",
      },
      {
        id: 30,
        name: "TDD",
      },
      {
        id: 31,
        name: "Agile",
      },
      {
        id: 32,
        name: "Scrum",
      },
      {
        id: 33,
        name: "Jira",
      },
      {
        id: 34,
        name: "Confluence",
      },
      {
        id: 35,
        name: "Photoshop",
      },
      {
        id: 36,
        name: "Illustrator",
      },
      {
        id: 37,
        name: "UI/UX Design",
      },
      {
        id: 38,
        name: "Sketch",
      },
      {
        id: 39,
        name: "Figma",
      },
      {
        id: 40,
        name: "InVision",
      },
      {
        id: 41,
        name: "Adobe XD",
      },
      {
        id: 42,
        name: "HTML",
      },
      {
        id: 43,
        name: "CSS",
      },
      {
        id: 44,
        name: "SASS",
      },
      {
        id: 45,
        name: "LESS",
      },
      {
        id: 46,
        name: "Bootstrap",
      },
    ];
    for (let i = 0; i < allTags.length; i++) {
      tags.push({
        tag_name: allTags[i].name,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }
    await queryInterface.bulkInsert("Tags", tags, { fields: ["tag_name"] });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
