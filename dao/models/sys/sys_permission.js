module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "sys_permission",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
      },
      sys_role_code: { type: DataTypes.STRING, unique: "rolePermissionUnique" },
      permission: {
        type: DataTypes.STRING,
        unique: "rolePermissionUnique"
      }
    },
    {
      underscored: true
    }
  );
};
