import { types } from "mobx-state-tree";

export const Permissions = types
  .model("Permissions", {
    id: types.number,
    name: types.string,
    guard_name: types.string,
    created_at: types.string,
    updated_at: types.string,
    permission_id: types.number,
    role_id: types.number,
  })
  .actions((self) => ({}))
  .views((self) => ({}));
