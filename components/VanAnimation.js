import React from 'react';
import styles from './VanAnimation.module.css';

const VanAnimation = () => {
  return (
    <div className={styles.animationContainer}>
      <div className={styles.van}>
        <div className={styles.smoke}></div>
        <div className={styles.smoke}></div>
        <div className={styles.smoke}></div>
      </div>
    </div>
  );
};

export default VanAnimation;