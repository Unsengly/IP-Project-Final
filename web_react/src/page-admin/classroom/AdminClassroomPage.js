import React, { useEffect, useRef, useState } from "react";
import { request } from "../../util/request";
import { Button, Col, DatePicker, Form, Input, InputNumber, Modal, Row, Select, Space, Table, Tag, TimePicker, message, notification } from "antd";
import dayjs from "dayjs";
import { formatDateClient, formatDateServer, formatTimeClient, formatTimeServer, getUserConfig } from "../../util/service";
import { ExclamationCircleFilled } from "@ant-design/icons";
import MainAdminPage from "../../component/layout/MainAdminPage";
import { MdDelete } from "react-icons/md";
import { CiCircleMore } from "react-icons/ci";
import { MdMoreHoriz } from "react-icons/md";
import { MdEdit } from "react-icons/md";

function AdminClassroomPage() {
  const [list, setList] = useState([]);
  const [course, setCourse] = useState([]);
  const [teacher, setTeacher] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [visible, setVisible] = useState(0);
  const [visibleDetails, setVisibleDetails] = useState(0);
  const [itemParent, setItemParent] = useState({});
  const [itemDetails, setItemDetails] = useState({});

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
    const res = await request("classroom", "get", param);
    setLoading(false);
    if (res) {
      setList(res.list);
      setCourse(res.course);
      setTeacher(res.teacher);
      if (filter.current.page === 1) {
        setTotalRecords(res.totalRecords);
      }
    }
  };

  const onClickBtnEdit = (item, index) => {
    setVisible(true);
    // vannak
    var TimeDuration = [null, null];
    var DateDuration = [null, null];

    if (item.StartTime && item.EndTime) {
      TimeDuration = [dayjs("0000-00-00 " + item.StartTime), dayjs("0000-00-00 " + item.EndTime)];
    }
    if (item.StartDate && item.EndDate) {
      DateDuration = [dayjs(item.StartDate), dayjs(item.EndDate)];
    }
    formRef.setFieldsValue({
      ...item,
      Dob: dayjs(item.Dob),
      Id: item.Id, // try create new key Id .
      TimeDuration,
      DateDuration,
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
    item.StartDate = null;
    item.EndDate = null;
    item.StartTime = null;
    item.EndTime = null;
    if (item.DateDuration) {
      item.StartDate = formatDateServer(item.DateDuration[0]);
      item.EndDate = formatDateServer(item.DateDuration[1]);
    }
    if (item.TimeDuration) {
      item.StartTime = formatTimeServer(item.TimeDuration[0]);
      item.EndTime = formatTimeServer(item.TimeDuration[1]);
    }
    const body = {
      ...item,
      Id: formRef.getFieldValue("Id"),
    };
    console.log(body);
    return;
    const method = formRef.getFieldValue("Id") ? "put" : "post";
    const res = await request("classroom", method, body);
    if (res?.error) {
      if (res.error) {
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

  const onChnageCourse = async (value) => {
    // find course price
    const findCourse = course.find((item, index) => item.Id === value);
    formRef.setFieldValue("Class_Price", findCourse.Price);
    // find course generation
    const res = await request("classroom/get_gn/" + value, "get");
    if (res) {
      formRef.setFieldValue("CourseGeneration", res.generation);
    }
  };

  const onViewMore = async (item, index) => {
    // item.Id ,....
    // aaaa
    const res = await request("student_by_classroom/" + item.Id, "get");
    if (res) {
      setItemDetails(res.list);
      setVisibleDetails(true);
    }
  };

  const config = getUserConfig();
  {
    /* TeacherId, //*
        CourseId, //*
        CourseGeneration, //*
        Course_Price,
        Class_Discount,
        Class_Discount_Price,
        Class_Price,
        LearningType, //*
        ClassStatus, //*
        ClassShiff, //*
        StartTime,
        EndTime,
        StartDate,
        EndDate,
        IsActive,
        Note, */
  }
  return (
    <MainAdminPage loading={loading}>
      <div className={"contianFilter"}>
        <Space>
          <div>
            <p className="txtTitle">Classroom ({list?.length})</p>
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
              formRef.setFieldsValue({
                IsActive: 1,
                ClassStatus: "Pending",
              });
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
            key: "CourseName",
            title: "CourseName",
            dataIndex: "CourseName",
          },
          {
            key: "TeacherName",
            title: "TeacherName",
            dataIndex: "TeacherName",
          },
          {
            key: "ClassStatus",
            title: "ClassStatus",
            dataIndex: "ClassStatus",
          },
          {
            key: "ClassShiff",
            title: "ClassShiff",
            dataIndex: "ClassShiff",
          },
          {
            key: "LearningType",
            title: "LearningType",
            dataIndex: "LearningType",
          },
          {
            key: "Price",
            title: "Class Price",
            dataIndex: "Class_Price",
          },
          {
            key: "TotalRegister",
            title: "Register",
            dataIndex: "TotalRegister",
          },
          {
            key: "TotalToPay",
            title: "Amount",
            dataIndex: "TotalToPay",
          },
          {
            key: "TotalPaid",
            title: "Paid",
            dataIndex: "TotalPaid",
          },
          {
            key: "Due",
            title: "Due",
            render: (value, items) => Number(items.TotalToPay) - Number(items.TotalPaid),
          },
          {
            key: "Time",
            title: "Time",
            render: (value, items) => formatTimeClient(items.StartTime) + "-" + formatTimeClient(items.EndTime),
          },
          {
            key: "Date",
            title: "Date",
            render: (value, items) => formatDateClient(items.StartDate) + "-" + formatDateClient(items.EndDate),
          },
          // {
          //   key: "IsActive",
          //   title: "IsActive",
          //   dataIndex: "IsActive",
          //   render: (value, item, index) => (value === 1 ? <Tag color="green">Active</Tag> : <Tag color="red">InActive</Tag>),
          // },
          // {
          //   key: "CreateAt",
          //   title: "CreateAt",
          //   dataIndex: "CreateAt",
          //   render: (value) => formatDateClient(value), //dayjs(value).format("DD/MM/YYYY"),
          // },
          {
            key: "Action",
            title: "Action",
            dataIndex: "Id",
            align: "center",
            render: (value, items, index) => (
              <Space>
                <Button onClick={() => onClickBtnEdit(items, index)} type="primary" icon={<MdEdit />} />
                <Button onClick={() => onClickBtnDelete(items, index)} type="primary" icon={<MdDelete />} danger />
                <Button onClick={() => onViewMore(items, index)} type="primary" icon={<MdMoreHoriz />} />
              </Space>
            ),
          },
        ]}
      />
      <Modal maskClosable={false} width={600} open={visible} onCancel={onCloseForm} title={formRef.getFieldValue("Id") ? "Edit Classroom" : "New Classroom"} footer={null}>
        <Form form={formRef} layout="vertical" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Teacher" name="TeacherId" rules={[{ required: "true", message: "Please select teacher!" }]}>
                <Select placeholder="Select Teacher">
                  {teacher.map((item, index) => (
                    <Select.Option value={item.Id} key={index}>
                      {item.FirstName}-{item.LastName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="Course" name="CourseId" rules={[{ required: "true", message: "Please select course!" }]}>
                <Select placeholder="Select Course" onChange={onChnageCourse} disabled={formRef.getFieldValue("Id")}>
                  {course.map((item, index) => (
                    <Select.Option value={item.Id} key={index}>
                      {item.Name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="Course GN" name="CourseGeneration">
                <InputNumber readOnly disabled style={{ width: "100%" }} placeholder="Course Genderation" />
              </Form.Item>
              <Form.Item label="Class Price" name="Class_Price">
                <InputNumber style={{ width: "100%" }} placeholder="Class Price" />
              </Form.Item>
              <Form.Item label="Learning Type" name="LearningType" rules={[{ required: "true", message: "Please select Learning Type!" }]}>
                <Select placeholder="Select Learning Type">
                  {config?.learning_type?.map((item, index) => (
                    <Select.Option value={item.Value} key={index}>
                      {item.Label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Class Status" name="ClassStatus" rules={[{ required: "true", message: "Please select Class Status!" }]}>
                <Select placeholder="Select Class Status">
                  {config?.classroom_status?.map((item, index) => (
                    <Select.Option value={item.Value} key={index}>
                      {item.Label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="Class shiff" name="ClassShiff" rules={[{ required: "true", message: "Please select Class shiff!" }]}>
                <Select placeholder="Select Class shiff">
                  {config?.classroom_shiff?.map((item, index) => (
                    <Select.Option value={item.Value} key={index}>
                      {item.Label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Time Study" name="TimeDuration">
                <TimePicker.RangePicker use12Hours format="h:mm a" />
              </Form.Item>

              <Form.Item label="Date Duration" name="DateDuration">
                <DatePicker.RangePicker format="DD/MM/YYYY" />
              </Form.Item>

              <Form.Item label="IsActive" name="IsActive" rules={[{ required: "true", message: "Please fill in status!" }]}>
                <Select style={{ width: "100%" }} placeholder="Status" allowClear>
                  <Select.Option value={1}>Active</Select.Option>
                  <Select.Option value={0}>InActive</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Note" name="Note">
            <Input.TextArea placeholder="Note" />
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

      <Modal maskClosable={false} width={700} open={visibleDetails} onCancel={() => setVisibleDetails(false)} title={"View Details"} footer={null}>
        {/* aaaa */}
        <Table
          dataSource={itemDetails}
          pagination={false}
          columns={[
            {
              key: "NO",
              title: "NO",
              render: (value, item, index) => index + 1,
            },
            {
              key: "StudentName",
              title: "StudentName",
              dataIndex: "StudentName",
            },
            {
              key: "Tel",
              title: "Tel",
              dataIndex: "Tel",
            },
            {
              key: "Telegram",
              title: "Telegram",
              dataIndex: "Telegram",
            },
            {
              key: "TotalToPay",
              title: "TotalToPay",
              dataIndex: "TotalToPay",
            },
            {
              key: "TotalPaid",
              title: "TotalPaid",
              dataIndex: "TotalPaid",
            },
            {
              key: "Due",
              title: "Due",
              render: (_, item) => item.TotalToPay - item.TotalPaid,
            },
          ]}
          summary={(pageData) => {
            let T_TotalToPay = 0;
            let T_TotalPaid = 0;
            pageData.forEach(({ TotalToPay, TotalPaid }) => {
              T_TotalToPay += Number(TotalToPay);
              T_TotalPaid += Number(TotalPaid);
            });
            return (
              <>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={4}>
                    Total ({pageData.length})
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1}>
                    <div type="danger">{T_TotalToPay}</div>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2}>
                    <div type="danger">{T_TotalPaid}</div>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={3}>
                    <div type="danger">{T_TotalToPay - T_TotalPaid}</div>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </>
            );
          }}
        />
      </Modal>
    </MainAdminPage>
  );
}

export default AdminClassroomPage;
