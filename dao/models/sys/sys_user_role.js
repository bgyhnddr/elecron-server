module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "sys_user_role",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
      },
      sys_user_id: { type: DataTypes.UUID, unique: "userRoleUnique" },
      sys_role_code: { type: DataTypes.STRING, unique: "userRoleUnique" }
    },
    {
      underscored: true
    }
  );
};
