import React, { useEffect, useState } from "react";
import { DesktopOutlined, FileOutlined, PieChartOutlined, SmileOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import { Dropdown, Layout, Menu, theme, ConfigProvider, Input, Badge } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import styles from "./MainLayoutAdmin.module.css";
import { getIsLogin, getRoleMenu, getUser, logout, setUserConfig } from "../../util/service";
import { FaUserGraduate } from "react-icons/fa";
import { FaChalkboardTeacher } from "react-icons/fa";
import { AiFillDashboard } from "react-icons/ai";
import { GiTeacher } from "react-icons/gi";
import { FaLaptopCode } from "react-icons/fa6";
import { CiSettings } from "react-icons/ci";
import { IoIosNotifications } from "react-icons/io";
import { MdEmail, MdSettings } from "react-icons/md";
import { BsFlagFill } from "react-icons/bs";

// other
import { IoMdSave } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { TiDelete } from "react-icons/ti";
import { IoList } from "react-icons/io5";
import { MdFilterListAlt } from "react-icons/md";
import { request } from "../../util/request";
const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

// const permission_menu_web = [
//   "/admin",
//  "/admin/classroom",
//  "/admin/classroom",
//  "/admin/course_category"
// ];

// Admin = [
//   {
//     route: "/admin"
//   },
//   {
//     route: "/admin/classroom"
//   },
//   {
//     route: "/admin/teacher"
//   },
//   {
//     route: "/admin/student"
//   },
//   {
//     route: "/admin/course"
//   },
//   {
//     route: "/admin/course_category"
//   },
//   {
//     route: "/admin/user"
//   },
//   {
//     route: "/admin/role"
//   }
// ]
// Teacher = [
//   {
//     route: "/admin"
//   },
//   {
//     route: "/admin/course"
//   },
//   {
//     route: "/admin/course_category"
//   }
// ]

const items = [
  {
    key: "1",
    label: "Profile",
    icon: <SmileOutlined />,
    onClick: () => {
      alert("ee");
    },
  },
  {
    key: "2",
    label: "Chnage Password",
    icon: <SmileOutlined />,
    // disabled: true,
  },
  {
    key: "3",
    label: "Setting",
    icon: <SmileOutlined />,
  },
  {
    key: "logout",
    danger: true,
    label: "Logout",
    icon: <SmileOutlined />,
    onClick: () => {
      logout();
    },
  },
];

const MainLayoutAdmin = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const permison_menu = getRoleMenu();
  const user = getUser();
  const location = useLocation();
  const { hash, pathname, search } = location;
  useEffect(() => {
    getUserConfig();
    if (!getIsLogin()) {
      window.location.href = "login";
    }
    if (!checkIsPathHasPermission()) {
      navigate(-1);
    }
  }, []);

  const getUserConfig = async () => {
    const res = await request("users/getConfig", "post");
    if (res) {
      setUserConfig(JSON.stringify(res.config));
    }
  };

  const checkIsPathHasPermission = () => {
    var isFound = 0;
    permison_menu?.forEach((item, index) => {
      if (item.route === pathname) {
        isFound = 1;
      }
    });
    if (isFound === 0) {
      return false;
    }
    return true;
  };

  if (user == null) {
    return null;
  }

  const onClickMenu = (params) => {
    navigate(params.key);
  };

  var itemsMenu = [];
  const itemsMenuAll = [
    getItem("Dashboard", "/admin", <AiFillDashboard />),
    getItem("Enroll", "/admin/enroll", <GiTeacher />),
    getItem("Classroom", "/admin/classroom", <GiTeacher />),
    getItem("Teacher", "/admin/teacher", <FaChalkboardTeacher />),
    getItem("Student", "/admin/student", <FaUserGraduate />),
    getItem("Course", "/admin/course", <FaUserGraduate />, [
      getItem("Course", "/admin/course"),
      getItem("Course Category", "/admin/course_category"), //course_category
      getItem("Course lesson", "/admin/course_lesson"),
      getItem("Course Outline", "/admin/course_outline"),
      getItem("Course Feedback", "/admin/course_feed"),
    ]),
    getItem("User", "/admin/user", <UserOutlined />, [getItem("User", "/admin/user"), getItem("Role", "/admin/role")]),
    getItem("Setting", "/admin/setting", <CiSettings />, [getItem("Setting1", "3"), getItem("Setting2", "4")]),
  ];

  permison_menu.forEach((item, index) => {
    itemsMenuAll.forEach((item1, index1) => {
      if (item.route === item1.key) {
        // item1.children;
        var children_new = null;
        if (item1?.children?.length > 0) {
          children_new = [];
          item1.children.forEach((a1, i1) => {
            permison_menu.forEach((b1, j1) => {
              if (a1.key === b1.route) {
                children_new.push(a1);
              }
            });
          });
        }
        item1.children = children_new;
        itemsMenu.push(item1);
      }
    });
  });

  return (
    <ConfigProvider
      theme={{
        token: {
          // Seed Token
          colorPrimary: "#00b96b",
          borderRadius: 5,

          // Alias Token
          // colorBgContainer: "#f6ffed",
        },

        components: {
          Layout: {
            // siderBg: "#FFF",
            // triggerBg: "#eee",
            // triggerColor: "#000",
            // colorPrimary: "#00b96b",
              // colorPrimary: "#00b96b",
          },
          Menu: {
            itemBg: "#FFF",
          },
          Button: {
            // colorPrimary: "red",
          },
        },
      }}
    >
      <Layout
        style={{
          minHeight: "100vh",
        }}
      >
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
          <div className="demo-logo-vertical" />
          <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline" items={itemsMenu} onClick={onClickMenu} />
        </Sider>
        <Layout>
          <div className={styles.headerContainter}>
            <div className={styles.hearderG1}>
              <div className={styles.logo}>
                <div style={{ color: "#FFFFFF" }}>USL</div>
              </div>
              <div>
                <div className={styles.brandName}> USL School</div>
                <div className={styles.subBrandName}> Build IT Skill</div>
              </div>
              <Input.Search placeholder="Search" style={{ width: 180, marginLeft: 20 }} size="large" />
            </div>
            <div className={styles.hearderG2}>
              <Badge count={10} overflowCount={2} style={{ marginRight: 12 }}>
                <MdEmail className={styles.homeIcon} />
              </Badge>
              <BsFlagFill className={styles.homeIcon} color="green" />
              <MdSettings className={styles.homeIcon} />
              <Dropdown
                menu={{
                  items,
                }}
                onClick={(object) => {
                  console.log(object);
                }}
              >
                <div style={{ textAlign: "right", cursor: "pointer", color: "green", marginRight: 10, marginLeft: 25 }}>
                  <div className={styles.userName}>{user?.Username}</div>
                  <div className={styles.roleName}>{user?.RoleName}</div>
                </div>
              </Dropdown>
              <div>
                <img className={styles.userImage} src={require("../../assests/icon/profile.jpg")} alt="" />
              </div>
            </div>
          </div>
          <Content
            style={{
              margin: "10px",
            }}
          >
            <div
              style={{
                padding: 24,
                height: "calc(100vh - 80px)",
                overflow: "scroll",

                scrollbarColor: "#999 #e0e0e0",
                scrollbarWidth: "none",
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
                boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
              }}
            >
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};
export default MainLayoutAdmin;

// import { Outlet, Link, useNavigate } from "react-router-dom";
// import styles from "./MainLayout.module.css";
// import { useEffect } from "react";
// import { getAccessToken, getIsLogin, getUser, logout } from "../../util/service";
// const MainLayoutAdmin = () => {
//   const navigate = useNavigate();
//   const user = getUser();

//   useEffect(() => {
//     if (!getIsLogin()) {
//       window.location.href = "/login";
//     }
//   }, []);

//   if (user == null) {
//     return null;
//   }

//   const onClickBtn1 = () => {
//     ///.....
//     // window.location.href = "/student"; // reload
//     navigate("/student");
//   };

//   const onLogout = () => {
//     logout();
//   };

//   return (
//     <div>
//       <div>User Login : {user.Username}</div>
//       <div>User access_token : {}</div>
//       <ul className={styles.menu} style={{ backgroundColor: "gray" }}>
//         <li className={styles.item}>
//           <Link to={"/admin"} class="active">
//             Dashboard
//           </Link>
//         </li>
//         <li className={styles.item}>
//           <Link to="/admin/teacher">Teacher</Link>
//         </li>
//         <li className={styles.item}>
//           <Link to={"/admin/student"}>Student</Link>
//         </li>
//         <li className={styles.item}>
//           <a href="#" onClick={onLogout}>
//             Logout
//           </a>
//         </li>
//       </ul>
//       {/* <button onClick={onClickBtn1}>Link To About</button> */}
//       <div>
//         <Outlet />
//       </div>
//     </div>
//   );
// };
// export default MainLayoutAdmin;
