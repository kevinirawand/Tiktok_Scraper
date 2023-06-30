'use strict';
import { Model } from 'sequelize';

module.exports = (sequelize: any, DataTypes: any) => {
   class tbl_scraping extends Model {
      /**
       * Helper method for defining associations.
       * This method is not a part of Sequelize lifecycle.
       * The `models/index` file will call this method automatically.
       */
      static associate(models: any) {
         // define association here
      }
   }
   tbl_scraping.init(
      {
         tiktok_username: DataTypes.STRING,
         url: DataTypes.STRING,
         follower_count: DataTypes.STRING,
         like_count: DataTypes.INTEGER,
         comment_count: DataTypes.INTEGER,
         response_count: DataTypes.INTEGER,
         taken_at: DataTypes.DATE,
      },
      {
         sequelize,
         modelName: 'tbl_scraping',
         underscored: true,
      },
   );
   return tbl_scraping;
};
