'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            models.User.hasMany(models.Comment);
            models.User.hasMany(models.Article)
        }
    };
    User.init({
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        lastname: DataTypes.STRING,
        firstname: DataTypes.STRING,
        admin: DataTypes.BOOLEAN
    }, {
        sequelize,
        timestamps: false,
        modelName: 'User',
    });
    return User;
};