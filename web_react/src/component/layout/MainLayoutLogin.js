import { Outlet } from "react-router-dom";
const MainLayoutLogin = () => {
  return (
    <div>
      <div style={{ height: 60, backgroundColor: "pink" }}></div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};
export default MainLayoutLogin;
