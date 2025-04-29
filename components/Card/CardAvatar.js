import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
export default function CardAvatar(props) {
  // const classes = useStyles();
  const { children, ...rest } = props;
  return <div {...rest}>{children}</div>;
}
