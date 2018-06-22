module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "sys_role",
    {
      id: {
        type: DataTypes.UUID,
        unique: "id",
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
      },
      code: { type: DataTypes.STRING, primaryKey: true },
      name: DataTypes.STRING
    },
    {
      underscored: true
    }
  );
};
