'use strict';

module.exports = {
  up: function (queryInterface, DataTypes) {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      firstname: {
        type: DataTypes.STRING
      },
      lastname: {
        type: DataTypes.STRING
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      username:{
        type:DataTypes.STRING,
        allowNull:false
      },
      display_name:{
        type:DataTypes.STRING,
        allowNull:false,
        defaultValue: ''
      },
      email:{
        type:DataTypes.STRING,
        allowNull:false
      },
      profile_image_url:{
        type:DataTypes.STRING
      },
      roles:{
        type:DataTypes.JSON,
        defaultValue: ['user'],
        isArray:true
      },
      hashed_password:{
        type:DataTypes.STRING,
        defaultValue: ''
      },
      provider:{
        type:DataTypes.STRING,
        defaultValue: ''
      },
      provider_data:{
        type:DataTypes.JSON
      },
      additional_providers_data:{
        type:DataTypes.JSON
      },
      salt:{
        type:DataTypes.STRING
      },
      token:{
        type:DataTypes.STRING
      },
      expires:{
        type:DataTypes.DATE
      },
      reset_password_token:{
        type:DataTypes.STRING
      },
      reset_password_expires:{
        type:DataTypes.STRING
      }
    });
  },

  down: function (queryInterface, DataTypes) {

    return queryInterface.dropTable('users');
  }
};
