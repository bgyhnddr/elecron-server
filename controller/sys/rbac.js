let rbac_service = require("../../service/rbac_service");
let permissions = require("../../config/permissions");

module.exports = [
  {
    permissions: [permissions.rbac],
    path: "/sys/getUsers",
    async callback(args) {
      return await rbac_service.getUsers(
        args.data.filterKey,
        args.data.size,
        args.data.page
      );
    }
  },
  {
    permissions: [permissions.rbac],
    path: "/sys/addUser",
    async callback(args) {
      return await rbac_service.addUser(args.data);
    }
  },
  {
    permissions: [permissions.rbac],
    path: "/sys/editUser",
    async callback(args) {
      return await rbac_service.editUser(args.data);
    }
  },
  {
    permissions: [permissions.rbac],
    path: "/sys/removeUser",
    async callback(args) {
      return await rbac_service.removeUser(args.data.id);
    }
  },
  {
    permissions: [permissions.rbac],
    path: "/sys/getRoles",
    async callback(args) {
      return await rbac_service.getRoles();
    }
  },
  {
    permissions: [permissions.rbac],
    path: "/sys/editRole",
    async callback(args) {
      return await rbac_service.editRole(args.data);
    }
  },
  {
    permissions: [permissions.rbac],
    path: "/sys/removeRole",
    async callback(args) {
      return await rbac_service.removeRole(
        args.data.code
      );
    }
  },
  {
    permissions: [permissions.rbac],
    path: "/sys/getPermissions",
    async callback(args) {
      return await rbac_service.getPermissions();
    }
  },
  {
    permissions: [permissions.rbac],
    path: "/sys/getUserRoles",
    async callback(args) {
      return await rbac_service.getUserRoles(args.data.id);
    }
  },
  {
    permissions: [permissions.rbac],
    path: "/sys/editUserRoles",
    async callback(args) {
      return await rbac_service.editUserRoles(
        args.data.id,
        args.data.roles
      );
    }
  },
  {
    permissions: [permissions.rbac],
    path: "/sys/getRolePermissions",
    async callback(args) {
      return await rbac_service.getRolePermissions(
        args.data.code
      );
    }
  },
  {
    permissions: [permissions.rbac],
    path: "/sys/editRolePermissions",
    async callback(args) {
      return await rbac_service.editRolePermissions(
        args.data.code,
        args.data.permissions
      );
    }
  }
];
