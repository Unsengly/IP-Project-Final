import React from "react";
import { GiEuropeanFlag } from "react-icons/gi";
import styles from "./Loading.module.css";
function Loading({ children }) {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.loader}></div>
      </div>
      {children}
    </>
  );
}

export default Loading;
