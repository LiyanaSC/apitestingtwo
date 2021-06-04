'use strict';
module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.createTable('Comments', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            userId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'Users',
                    key: 'id'
                }
            },
            articleId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'Articles',
                    key: 'id'
                }
            },
            content: {
                allowNull: false,
                type: Sequelize.STRING
            },
            createdAt: {
                timestamps: false,
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                timestamps: false,
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async(queryInterface, Sequelize) => {
        await queryInterface.dropTable('Comments');
    }
};