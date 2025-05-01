import React, { useState, useEffect } from 'react';
import styles from './VanAnimation.module.css';

const VanAnimation = () => {
  const [showStore, setShowStore] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowStore(true);
    }, 1500); // Adjust the time to match the van animation duration

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.animationContainer}>
      {/*<div className={`${styles.road} ${styles.top}`}></div>*/}
          <div className={styles.van}>
            <div className={styles.smoke}></div>
            <div className={styles.smoke}></div>
            <div className={styles.smoke}></div>
          </div>
          {/*<div className={`${styles.road} ${styles.bottom}`}></div>*/}
      {/*{showStore && (
        <div
          className={styles.store}
        />
      )}*/}
    </div>
  );
};

export default VanAnimation;