import { Outlet, Link, useNavigate } from "react-router-dom";
import styles from "./MainLayout.module.css";
const MainLayout = () => {
  const navigate = useNavigate();

  const onClickBtn1 = () => {
    ///.....
    // window.location.href = "/student"; // reload
    navigate("/student");
  };

  return (
    <div>
      <ul className={styles.menu}>
        <li className={styles.item}>
          <Link to={"/"} class="active">
            Home
          </Link>
        </li>
        <li className={styles.item}>
          <Link to="/student">Student</Link>
        </li>
        <li className={styles.item}>
          <Link to={"/about"}>About</Link>
        </li>
        <li className={styles.item}>
          <Link to={"/admin"}>Admin</Link>
        </li>
        <li className={styles.item}>
          <Link to={"/login"}>Loing</Link>
        </li>
      </ul>
      {/* <button onClick={onClickBtn1}>Link To About</button> */}
      <div>
        <Outlet />
      </div>
    </div>
  );
};
export default MainLayout;
