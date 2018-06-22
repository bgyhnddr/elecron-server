module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "sys_user",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
      },
      account: { type: DataTypes.STRING, unique: true },
      password: DataTypes.STRING
    },
    {
      underscored: true
    }
  );
};
