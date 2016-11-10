'use strict';

module.exports = {
  up: function (queryInterface, DataTypes) {

    return queryInterface.createTable('projects', {
      id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      command_reference: {
        type: DataTypes.STRING,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      client_planned_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      client_delivered_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      planned_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      delivered_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      description: {
        type: DataTypes.TEXT,
        field: 'description'
      },
      note: {
        type: DataTypes.TEXT,
        field: 'note'
      },
      estimated_budget: {
        type: DataTypes.DOUBLE
      },
      client_budget: {
        type: DataTypes.DOUBLE
      },
      budget:  {
        type: DataTypes.DOUBLE
      },
      state:{
        type: DataTypes.ENUM('WAITING','ACTIVE','CLOSE','SUSPEND')
      },
      user_id:{
        type: DataTypes.INTEGER,
        references: {
          model:'users',
          key:'id',
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      }
    });
  },

  down: function (queryInterface, DataTypes) {

    return queryInterface.dropTable('projects');
  }
};
