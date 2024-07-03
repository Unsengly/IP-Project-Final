import React, { useEffect, useRef, useState } from "react";
import { request } from "../../util/request";
import { Button, DatePicker, Form, Input, Modal, Select, Space, Table, Tag, message, notification } from "antd";
import dayjs from "dayjs";
import { formatDateClient, formatDateServer } from "../../util/service";
import { ExclamationCircleFilled } from "@ant-design/icons";
import styles from "./AdminStudentPage.module.css";
import MainAdminPage from "../../component/layout/MainAdminPage";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";

function AdminStudentPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [visible, setVisible] = useState(0);
  const [formTeacher] = Form.useForm();

  const filter = useRef({
    txtSearch: "",
    status: null,
    page: 1,
  });

  useEffect(() => {
    getList();
    formTeacher.setFieldsValue({
      Gender: "1",
    });
  }, []);

  const getList = async () => {
    setLoading(true);
    var param = {
      txtSearch: filter.current.txtSearch,
      status: filter.current.status,
      page: filter.current.page,
    };
    const res = await request("student", "get", param);
    setLoading(false);
    if (res) {
      setList(res.list);
      if (filter.current.page === 1) {
        setTotalRecords(res.totalRecords);
      }
    }
  };

  const onClickBtnEdit = (item, index) => {
    setVisible(true);
    formTeacher.setFieldsValue({
      ...item,
      Dob: dayjs(item.Dob),
      Gender: item.Gender === null ? null : item.Gender + "", // numeric null 0
      Id: item.Id, // try create new key Id .
    });
  };

  const onClickBtnDelete = (item, index) => {
    Modal.confirm({
      title: "Delete",
      icon: <ExclamationCircleFilled />,
      content: "Are you sure to remove this student?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        const res = await request("student/" + item.Id, "delete");
        if (res) {
          message.success(res.message);
          getList();
        }
      },
      onCancel() {},
    });
  };

  const onCloseForm = () => {
    setVisible(false);
    formTeacher.resetFields();
  };

  const onFinish = async (item) => {
    const body = {
      ...item,
      Dob: formatDateServer(item.Dob),
      Id: formTeacher.getFieldValue("Id"),
    };
    const method = formTeacher.getFieldValue("Id") ? "put" : "post";
    const res = await request("student", method, body);
    if (res?.error) {
      if (res.error?.acount_exist) {
        notification.error({
          message: "Submit data",
          description: res.error?.acount_exist,
        });
        return;
      }
    } else if (res?.list) {
      message.success(res.message);
      getList();
      onCloseForm();
    }
  };

  const handleFilter = () => {
    getList();
  };

  const onChangeSearch = (event) => {
    filter.current.txtSearch = event.target.value;
  };

  const handleStatus = (value) => {
    filter.current.status = value;
  };

  return (
    <MainAdminPage loading={loading}>
      <div className={styles.contianFilter}>
        <Space>
          <div>
            <p className="txtTitle">Student</p>
          </div>
          <Input.Search placeholder="Search name or tel" onChange={onChangeSearch} />
          <Select style={{ width: 150 }} placeholder="Status" allowClear onChange={handleStatus}>
            <Select.Option value="1">Active</Select.Option>
            <Select.Option value="0">InActive</Select.Option>
          </Select>
          <Button onClick={handleFilter} type="primary">
            Filter
          </Button>
        </Space>
        <div>
          <Button onClick={() => setVisible(true)} type="primary">
            New
          </Button>
        </div>
      </div>
      <Table
        bordered
        dataSource={list}
        // vannak
        pagination={{
          defaultPageSize: 10, // depend on setting
          total: totalRecords, // find from api
        }}
        onChange={(pagination) => {
          filter.current.page = pagination.current;
          getList();
        }}
        columns={[
          {
            key: "FirstName",
            title: "FirstName",
            dataIndex: "FirstName",
          },
          {
            key: "LastName",
            title: "LastName",
            dataIndex: "LastName",
          },
          {
            key: "Gender",
            title: "Gender",
            dataIndex: "Gender",
            render: (value, items, inde) => (value === null ? null : value === 1 ? "Male" : "Female"),
          },
          {
            key: "Dob",
            title: "Dob",
            dataIndex: "Dob",
            render: (value) => formatDateClient(value),
          },
          {
            key: "Tel",
            title: "Tel",
            dataIndex: "Tel",
          },
          {
            key: "Email",
            title: "Email",
            dataIndex: "Email",
          },
          {
            key: "Address",
            title: "Address",
            dataIndex: "Current_Address",
          },
          {
            key: "IsActive",
            title: "IsActive",
            dataIndex: "IsActive",
            render: (value, item, index) => (value == 1 ? <Tag color="green">Active</Tag> : <Tag color="red">InActive</Tag>),
          },
          {
            key: "CreateAt",
            title: "CreateAt",
            dataIndex: "CreateAt",
            render: (value) => formatDateClient(value), //dayjs(value).format("DD/MM/YYYY"),
          },
          {
            key: "Action",
            title: "Action",
            dataIndex: "Id",
            align: "center",
            render: (value, items, index) => (
              <Space>
                <Button onClick={() => onClickBtnEdit(items, index)} type="primary" icon={<MdEdit />} />
                <Button onClick={() => onClickBtnDelete(items, index)} type="primary" icon={<MdDelete />} danger />
              </Space>
            ),
          },
        ]}
      />
      <Modal maskClosable={false} open={visible} onCancel={onCloseForm} title={formTeacher.getFieldValue("Id") ? "Edit Student" : "New Student"} footer={null}>
        <Form form={formTeacher} layout="horizontal" labelCol={{ span: 7 }} wrapperCol={{ span: 17 }} onFinish={onFinish}>
          <Form.Item label="Firsname" name="FirstName" rules={[{ required: "true", message: "Please fill in firstname!" }]}>
            <Input placeholder="Firsname" />
          </Form.Item>
          <Form.Item label="Lastname" name="LastName" rules={[{ required: "true", message: "Please fill in lastname!" }]}>
            <Input placeholder="Lastname" />
          </Form.Item>
          <Form.Item label="Gender" name="Gender">
            <Select placeholder="Select Gender" defaultValue={"1"}>
              <Select.Option value={"1"}>Male</Select.Option>
              <Select.Option value={"0"}>Female</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Dob" name="Dob">
            <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Tel" name="Tel" rules={[{ required: "true", message: "Please fill in tel!" }]}>
            <Input placeholder="Tel" />
          </Form.Item>
          <Form.Item label="Email" name="Email">
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item label="Address" name="Current_Address">
            <Input.TextArea placeholder="Address" />
          </Form.Item>
          <div style={{ textAlign: "right" }}>
            <Space>
              <Button>Cancel</Button>
              <Button type="primary" htmlType="submit">
                {formTeacher.getFieldValue("Id") ? "Update" : "Submit"}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </MainAdminPage>
  );
}

export default AdminStudentPage;
