import React, { useEffect, useRef, useState } from "react";
import { request } from "../../util/request";
import { Button, DatePicker, Form, Input, InputNumber, Modal, Select, Space, Table, Tag, message, notification } from "antd";
import dayjs from "dayjs";
import { formatDateClient, formatDateServer } from "../../util/service";
import { ExclamationCircleFilled } from "@ant-design/icons";
import styles from "./AdminCoursePage.module.css";
import MainAdminPage from "../../component/layout/MainAdminPage";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";

function AdminCourseCategoryPage() {
  const [list, setList] = useState([]);
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [visible, setVisible] = useState(0);
  const [formRef] = Form.useForm();

  const filter = useRef({
    txtSearch: "",
    status: null,
    categoryId: null,
    page: 1,
  });

  useEffect(() => {
    getList();
    formRef.setFieldsValue({
      Gender: "1",
    });
  }, []);

  const getList = async () => {
    setLoading(true);
    var param = {
      txtSearch: filter.current.txtSearch,
      status: filter.current.status,
      page: filter.current.page,
      categoryId: filter.current.categoryId,
    };
    const res = await request("category", "get", param);
    setLoading(false);
    if (res) {
      setList(res.list);
      setCategory(res.category);
      if (filter.current.page === 1) {
        setTotalRecords(res.totalRecords);
      }
    }
  };

  const onClickBtnEdit = (item, index) => {
    setVisible(true);
    formRef.setFieldsValue({
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
      content: "Are you sure to remove this category?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        const res = await request("category/" + item.Id, "delete");
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
    formRef.resetFields();
  };

  const onFinish = async (item) => {
    const body = {
      ...item,
      Dob: formatDateServer(item.Dob),
      Id: formRef.getFieldValue("Id"),
    };
    const method = formRef.getFieldValue("Id") ? "put" : "post";
    const res = await request("category", method, body);
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

  const handleCategory = (value) => {
    filter.current.categoryId = value;
  };

  return (
    <MainAdminPage loading={loading}>
      <div className={styles.contianFilter}>
        <Space>
          <div>
            <p className="txtTitle">Category ({list?.length})</p>
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
            key: "Name",
            title: "Name",
            dataIndex: "Name",
          },
          {
            key: "Description",
            title: "Description",
            dataIndex: "Description",
          },
          {
            key: "Image",
            title: "Image",
            dataIndex: "Image",
          },
          {
            key: "IsActive",
            title: "IsActive",
            dataIndex: "IsActive",
            render: (value, item, index) => (value === 1 ? <Tag color="green">Active</Tag> : <Tag color="red">InActive</Tag>),
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
      <Modal maskClosable={false} open={visible} onCancel={onCloseForm} title={formRef.getFieldValue("Id") ? "Edit Category" : "New Category"} footer={null}>
        <Form form={formRef} layout="horizontal" labelCol={{ span: 7 }} wrapperCol={{ span: 17 }} onFinish={onFinish}>
          <Form.Item label="Category Name" name="Name" rules={[{ required: "true", message: "Please fill in category name!" }]}>
            <Input placeholder="Category Name" />
          </Form.Item>
          <Form.Item label="Description" name="Description">
            <Input.TextArea placeholder="Description" />
          </Form.Item>
          <Form.Item label="IsActive" name="IsActive" rules={[{ required: "true", message: "Please fill in status!" }]}>
            <Select style={{ width: "100%" }} placeholder="Status" allowClear>
              <Select.Option value={"1"}>Active</Select.Option>
              <Select.Option value={"0"}>InActive</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Image" name="Image">
            <input type="file" />
          </Form.Item>

          <div style={{ textAlign: "right" }}>
            <Space>
              <Button>Cancel</Button>
              <Button type="primary" htmlType="submit">
                {formRef.getFieldValue("Id") ? "Update" : "Submit"}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </MainAdminPage>
  );
}

export default AdminCourseCategoryPage;
