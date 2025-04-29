import { types } from "mobx-state-tree";
import { User } from "./user";

export const RootStore = types
  .model("RootStore", {
    user: User,
    hydrated: false,
  })
  .actions((self) => ({}))
  .views((self) => ({}));
