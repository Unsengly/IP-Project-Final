import React, { useEffect, useRef, useState } from "react";
import { request } from "../../util/request";
import { Button, DatePicker, Form, Input, InputNumber, Modal, Select, Space, Table, Tag, message, notification } from "antd";
import dayjs from "dayjs";
import { formatDateClient, formatDateServer, formatTimeClient, getUserConfig } from "../../util/service";
import { ExclamationCircleFilled } from "@ant-design/icons";
import MainAdminPage from "../../component/layout/MainAdminPage";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";

function AdmineEnrollStudent() {
  const [list, setList] = useState([]);
  const [student, setStudent] = useState([]);
  const [classroom, setClassroom] = useState([]);
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
  }, []);

  const getList = async () => {
    setLoading(true);
    var param = {
      txtSearch: filter.current.txtSearch,
      status: filter.current.status,
      page: filter.current.page,
      categoryId: filter.current.categoryId,
    };
    const res = await request("student_register", "get");
    setLoading(false);
    if (res) {
      setList(res.list);
      setClassroom(res.classroom);
      setStudent(res.student);
    }
  };

  const onClickBtnEdit = (item, index) => {
    setVisible(true);
    formRef.setFieldsValue({
      ...item,
      Dob: dayjs(item.Dob),
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
      PaymentDate: formatDateServer(item.PaymentDate),
      Id: formRef.getFieldValue("Id"),
    };
    const method = formRef.getFieldValue("Id") ? "put" : "post";
    const res = await request("student_register", method, body);
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

  const onChanageCourse = (value) => {
    const findCourse = classroom.find((item) => item.Id === value);
    if (findCourse) {
      formRef.setFieldValue("TotalToPay", findCourse.Class_Price);
    }
  };

  const config = getUserConfig();

  return (
    <MainAdminPage loading={loading}>
      <div className={"contianFilter"}>
        <Space>
          <div>
            <p className="txtTitle">Enroll ({list?.length})</p>
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
          <Button
            onClick={() => {
              setVisible(true);
              formRef.setFieldValue("PaymentDate", dayjs());
              formRef.setFieldValue("PaymentMethod", "ABA");
            }}
            type="primary"
          >
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
            key: "Student",
            title: "Student",
            render: (_, items) => items.FirstName + "-" + items.LastName,
          },
          {
            key: "CourseName",
            title: "CourseName",
            dataIndex: "CourseName",
          },
          {
            key: "TotalToPay",
            title: "TotalToPay",
            dataIndex: "TotalToPay",
          },
          {
            key: "Paid",
            title: "Paid",
            dataIndex: "Paid",
          },
          {
            key: "Due",
            title: "Due",
            render: (_, items) => Number(items.TotalToPay) - Number(items.Paid),
          },
          {
            key: "ClassInfo",
            title: "ClassInfo",
            render: (_, items) => (
              <div>
                <div>
                  {items.ClassShiff} | {items.Note}
                </div>
                <div>
                  {formatTimeClient(items.StartTime)}-{formatTimeClient(items.StartTime)} | {items.LearningType}
                </div>
                <div>
                  {formatDateClient(items.StartDate)}-{formatDateClient(items.EndDate)}
                </div>
              </div>
            ),
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
      <Modal maskClosable={false} open={visible} onCancel={onCloseForm} title={formRef.getFieldValue("Id") ? "Edit Enroll" : "New Enroll"} footer={null}>
        <Form form={formRef} layout="horizontal" labelCol={{ span: 7 }} wrapperCol={{ span: 17 }} onFinish={onFinish}>
          {/* // ClassRoomId, StudentId Discount, Discount_Price, TotalToPay
        // Payment, PaymentMethod, PaymentDate */}
          <Form.Item label="Select Student" name="StudentId" rules={[{ required: "true", message: "Please Select Student" }]}>
            <Select placeholder="Select Student">
              {student.map((item, index) => (
                <Select.Option key={index} value={item.Id}>
                  {item.FirstName}-{item.LastName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Select Course" name="ClassRoomId" rules={[{ required: "true", message: "Please Select Course" }]}>
            <Select placeholder="Select Course" onChange={onChanageCourse}>
              {classroom.map((item, index) => (
                <Select.Option key={index} value={item.Id}>
                  {item.CourseName + "-G" + item.CourseGeneration}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Discount" name="Discount">
            <InputNumber style={{ width: "100%" }} placeholder="Discount" />
          </Form.Item>
          <Form.Item label="Total To Pay" name="TotalToPay">
            <InputNumber disabled style={{ width: "100%" }} placeholder="Total To Pay" />
          </Form.Item>

          <Form.Item label="Payment" name="Payment">
            <InputNumber style={{ width: "100%" }} placeholder="Payment" />
          </Form.Item>
          <Form.Item label="PaymentMethod" name="PaymentMethod">
            <Select placeholder="Select Student">
              {config?.payment_method?.map((item, index) => (
                <Select.Option key={index} value={item.Value}>
                  {item.Label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="PaymentDate" name="PaymentDate">
            <DatePicker style={{ width: "100%" }} format={"DD/MM/YYYY"} placeholder="PaymentDate" />
          </Form.Item>

          <Form.Item label="Reamark" name="Note">
            <Input.TextArea placeholder="Reamark" />
          </Form.Item>

          <div style={{ textAlign: "right" }}>
            <Space>
              <Button onClick={() => onCloseForm()}>Cancel</Button>
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

export default AdmineEnrollStudent;
