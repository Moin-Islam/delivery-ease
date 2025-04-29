import React from "react";
import Router from "next/router";
import { useRootStore } from "./../models/root-store-provider";
import { observer } from "mobx-react-lite";

const index = observer(() => {
  const { user, hydrated } = useRootStore();
  console.log(hydrated);
  React.useEffect(() => {

    if (user.isLoggedIn) {

      Router.push("/dashboard/list");
    } else {
      Router.push("/login");
    }
  }, [hydrated]);

  return <div></div>;
});
export default index;
