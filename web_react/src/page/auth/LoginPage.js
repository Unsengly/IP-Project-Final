import React, { useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input } from "antd";
import styles from "./LoginPage.module.css";
import { request } from "../../util/request";
import { setAccessToken, setIsLogin, setRefreshToken, setRoleMenu, setUser } from "../../util/service";
const LoginPage = () => {
  const [message, setMessage] = useState("");

  const onFinish = async (values) => {
    var param = {
      Username: values.username,
      Password: values.password,
    };
    const res = await request("users/login", "post", param);
    if (res.message) {
      setMessage(res.message);
      setUser(JSON.stringify(res.user)); // JSON.stringify JSON(Obect)=>JSON(Object String))
      setRoleMenu(JSON.stringify(res.permison_menu));
      setIsLogin("1");
      setAccessToken(res.access_token);
      setRefreshToken(res.refresh_token);
      window.location.href = "admin";
    } else if (res.error) {
      if (res.error.Username) {
        setMessage(res.error.Username);
      }
      if (res.error.Password) {
        setMessage(res.error.Password);
      }
    }
  };
  return (
    <div className={styles.loginContainer}>
      <h3 style={{ color: "red" }}> Message: {message}</h3>
      <h1>Login</h1>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your Username!",
            },
          ]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Password" />
        </Form.Item>
        <div className={styles.txtForgot}>
          <a href="">Forgot password</a>
        </div>

        <Form.Item>
          <Button type="primary" htmlType="submit" className={styles.btnLogin}>
            Log in
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default LoginPage;
