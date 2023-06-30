'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.createTable('tbl_scrapings', {
         id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
         },
         tiktok_username: {
            type: Sequelize.STRING
         },
         url: {
            type: Sequelize.STRING
         },
         follower_count: {
            type: Sequelize.STRING
         },
         like_count: {
            type: Sequelize.INTEGER
         },
         comment_count: {
            type: Sequelize.INTEGER
         },
         response_count: {
            type: Sequelize.INTEGER
         },
         taken_at: {
            type: Sequelize.DATE
         },
         created_at: {
            allowNull: false,
            type: Sequelize.DATE
         },
         updated_at: {
            allowNull: false,
            type: Sequelize.DATE
         }
      });
   },
   async down(queryInterface, Sequelize) {
      await queryInterface.dropTable('tbl_scrapings');
   }
};