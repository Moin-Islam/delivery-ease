import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// // nodejs library to set properties for components
// import PropTypes from "prop-types";
// // @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// // @material-ui/icons

// // core components
import styles from "./../../styles/cardHeaderStyle.js";

const useStyles = makeStyles(styles);

export default function CardHeader(props) {
  const classes = useStyles();
  const { className, children, color, plain, stats, icon, ...rest } = props;
  console.log(color)
  const cardHeaderClasses = classNames({
    [classes.cardHeader]: true,
    [classes[color + "CardHeader"]]: color,
    [classes.cardHeaderPlain]: plain,
    [classes.cardHeaderStats]: stats,
    [classes.cardHeaderIcon]: icon,
    [className]: className !== undefined,
  });
  return (
    <div className={cardHeaderClasses} {...rest}>
      {children}
    </div>
  );
}
