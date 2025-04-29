import { Ability, AbilityBuilder } from "@casl/ability";
import { useRootStore } from "./../../models/root-store-provider";

const ability = new Ability();

export default (action, subject) => {
  //   const { user } = useRootStore();
  //   console.log(user.details.id);
  return ability.can(action, subject);
};

const defineRulesFor = () => {
  console.log("ssk");
  const { can, rules } = new AbilityBuilder();
  can("add", "users");
  return rules;
};
ability.update(defineRulesFor());
