import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// nodejs library to set properties for components

export default function CardFooter(props) {
  // const classes = useStyles();
  const { children, ...rest } = props;

  return <div {...rest}>{children}</div>;
}
