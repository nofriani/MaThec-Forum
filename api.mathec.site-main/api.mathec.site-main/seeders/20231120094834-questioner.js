'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // satu kategory
    const seedData = [
      {
        name: 'Usefulness',
        data: [
          'Sejauh mana penggunaan forum diskusi membantu Anda menjadi lebih efektif dalam kegiatan sehari-hari?',
          'Bagaimana forum diskusi membantu Anda meningkatkan produktivitas Anda?',
          'Menurut Anda, sejauh mana kehadiran forum diskusi bermanfaat bagi Anda?',
          'Bagaimana forum diskusi membantu Anda mengontrol aktivitas dalam hidup sehari-hari Anda?',
          'Apakah forum diskusi mempermudah pencapaian tujuan Anda?',
          'Sejauh mana penggunaan forum diskusi menghemat waktu Anda?',
          'Apakah forum diskusi memenuhi kebutuhan Anda?',
          'Sejauh mana forum diskusi mampu melakukan semua yang Anda harapkan?',
        ],
      },
      {
        name: 'Ease of Use',
        data: [
          'Bagaimana tingkat kesulitan penggunaan forum diskusi menurut Anda?',
          'Apakah forum diskusi mudah digunakan menurut pengalaman Anda?',
          'Seberapa mudah Anda menemukan forum diskusi ini dan mulai berpartisipasi?',
          'Menurut Anda, bagaimana tingkat kesulitan penggunaan forum diskusi ?',
          'Sejauh mana Anda merasa nyaman dan mudah menggunakan forum diskusi?',
          'Sejauh mana kemudahan penggunaan forum diskusi memengaruhi kepuasan Anda?',
          'Apakah Anda melihat adanya ketidakkonsistenan saat menggunakan forum diskusi?',
          'Bagaimana pendapat Anda mengenai kemudahan penggunaan forum diskusi ?',
          'Sejauh mana Anda dapat memulihkan kesalahan dengan cepat dan mudah saat menggunakan forum diskusi?',
          'Sejauh mana Anda dapat menggunakan forum diskusi dengan sukses setiap saat?',
        ],
      },
      {
        name: 'Ease of Learning',
        data: [
          'Bagaimana pengalaman Anda dalam belajar menggunakan forum diskusi? Apakah Anda merasa cepat memahaminya?',
          'Sejauh mana Anda mudah mengingat cara menggunakan forum diskusi setelah belajar?',
          'Apa yang membuat forum diskusi mudah untuk dipelajari menurut Anda?',
          'Sejauh mana Anda merasa menjadi terampil dalam menggunakan forum diskusi setelah belajar?',
        ],
      },
      {
        name: 'Satisfaction',
        data: [
          'Sejauh mana Anda merasa puas dengan penggunaan forum diskusi?',
          'Apakah Anda akan merekomendasikan penggunaan forum diskusi kepada teman atau kolega Anda?',
          'Bagaimana tingkat kepuasan Anda terhadap penggunaan forum diskusi?',
          'Apakah forum diskusi bekerja sesuai dengan harapan Anda?',
          'Bagaimana tingkat kehebatan forum diskusi menurut Anda?',
          'Sejauh mana Anda merasa perlu memiliki forum diskusi?',
          'Menurut Anda, sejauh mana forum diskusi nyaman untuk digunakan?',
          'Apakah Anda merasa sangat menyenangkan untuk digunakan?',
        ],
      },
    ];

    seedData.forEach((seed, index) => {
      queryInterface.bulkInsert(
        'CategoryQuestioners',
        [
          {
            id: index + 1,
            name: seed.name,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        {}
      );
    });

    let questioner = [];
    seedData.forEach((seed, index) => {
      seed.data.forEach(async element => {
        questioner.push({
          questioner: element,
          id_category_questioner: index + 1,
          created_at: new Date(),
          updated_at: new Date(),
        });
      });
    });

    await queryInterface.bulkInsert('Questioners', questioner, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('CategoryQuestioners', null, {});
    await queryInterface.bulkDelete('Questioners', null, {});
  },
};
