import { Sequelize, DataTypes, Model } from "sequelize";

const dbRoot = '/Users/spankyed/Develop/Projects/CurateGPT/services/database/sqlite';

export const sequelize = new Sequelize({
  // other options
  dialect: 'sqlite',
  storage: `${dbRoot}/curate.db`,
  // pool: {
  //   max: 10, // Maximum number of connections in pool
  //   min: 0, // Minimum number of connections in pool
  //   acquire: 30000, // The maximum time, in milliseconds, that pool will try to get connection before throwing error
  //   idle: 10000, // The maximum time, in milliseconds, that a connection can be idle before being released
  // },
});

export class PapersTable extends Model {
  declare id: string;
  declare date: string;
  declare title: string;
  declare abstract: string;
  declare authors: string;
  declare status: number;
  declare relevancy: number;
  declare liked: boolean;
  declare keywords: string;
}

export class DatesTable extends Model {
  declare value: string;
  declare status: string;
}

DatesTable.init({
  value: {
    type: DataTypes.STRING,
    primaryKey: true,
    unique: true
  },
  status: {
    type: DataTypes.STRING,
  },
}, { sequelize, modelName: 'DatesTable', tableName: 'Dates' });

PapersTable.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    unique: true
  },
  date: DataTypes.STRING,
  title: DataTypes.STRING,
  abstract: DataTypes.STRING,
  authors: DataTypes.STRING, // semi-colon separated list
  // metadata
  status: DataTypes.INTEGER,
  relevancy: DataTypes.INTEGER,
  liked: DataTypes.BOOLEAN,
  keywords: DataTypes.STRING, // semi-colon separated list
}, {
  sequelize,
  modelName: 'PapersTable',
  tableName: 'Papers',
  indexes: [
    {
      unique: false,
      fields: ['date']
    }
  ]
});

PapersTable.belongsTo(DatesTable, { foreignKey: 'date', targetKey: 'value' });
DatesTable.hasMany(PapersTable, { foreignKey: 'date', sourceKey: 'value' });

// export const PaperVideosTable = sequelize.define('PaperVideosTable', {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   paperId: DataTypes.STRING,
//   title: DataTypes.STRING,
//   description: DataTypes.STRING,
//   thumbnailPrompt: DataTypes.STRING,
//   scriptPrompt: DataTypes.STRING,
//   videoUrl: DataTypes.STRING,
//   thumbnailUrl: DataTypes.STRING
// });

// export const ConfigTable = sequelize.define('ConfigTable', {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   lastRun: DataTypes.STRING,
// });

// Assuming a one-to-one relationship between Papers and PaperVideos
// PapersTable.hasOne(PaperVideosTable, {
//   foreignKey: 'paperId'
// });
// PaperVideosTable.belongsTo(PapersTable, {
//   foreignKey: 'paperId'
// });
