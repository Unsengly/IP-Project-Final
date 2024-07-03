import React, { useEffect, useRef, useState } from "react";
import { request } from "../../util/request";
import { Button, DatePicker, Form, Image, Input, InputNumber, Modal, Select, Space, Table, Tag, Upload, message, notification } from "antd";
import dayjs from "dayjs";
import { formatDateClient, formatDateServer } from "../../util/service";
import { ExclamationCircleFilled } from "@ant-design/icons";
import styles from "./AdminCoursePage.module.css";
import MainAdminPage from "../../component/layout/MainAdminPage";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { Config } from "../../util/config";

function AdminCoursePage() {
  const [list, setList] = useState([]);
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [visible, setVisible] = useState(0);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [formRef] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [isRemoveFile, setIsRemoveFile] = useState(false);

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
      IsActive: "1",
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
    const res = await request("course", "get", param);
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
    if (item.Image) {
      setFileList([
        {
          uid: item.Image,
          name: item.Image,
          status: "done",
          url: Config.IMAGE_PATH + item.Image, //"https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
        },
      ]);
    }

    formRef.setFieldsValue({
      ...item,
      Dob: dayjs(item.Dob),
      Gender: item.Gender === null ? null : item.Gender + "", // numeric null 0
      Id: item.Id, // try create new key Id
      OldImage: item.Image,
      CategoryId: item.CategoryId + "",
      IsActive: item.IsActive + "",
    });
  };

  const onClickBtnDelete = (item, index) => {
    Modal.confirm({
      title: "Delete",
      icon: <ExclamationCircleFilled />,
      content: "Are you sure to remove this course?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        const res = await request("course/" + item.Id, "delete", { OldImage: item.Image });
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
    setFileList([]);
    setIsRemoveFile(false);
  };

  const onFinish = async (item) => {
    var fileUpload = null;
    if (item.Image?.fileList?.length > 0) {
      fileUpload = item.Image.fileList[0].originFileObj;
    }
    const body = {
      ...item,
      Dob: formatDateServer(item.Dob),
      Id: formRef.getFieldValue("Id"),
      OldImage: formRef.getFieldValue("OldImage"),
    };
    var form = new FormData();
    Object.keys(body).map((key, index) => {
      form.append(key, body[key]);
    });
    form.append("isRemoveFile", isRemoveFile);
    if (fileUpload) {
      form.append("ImageUpload", fileUpload, fileUpload.name);
    }
    const method = formRef.getFieldValue("Id") ? "put" : "post";
    const res = await request("course", method, form);
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

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  return (
    <MainAdminPage loading={loading}>
      <div className={styles.contianFilter}>
        <Space>
          <div>
            <p className="txtTitle">Course ({list?.length})</p>
          </div>
          <Input.Search placeholder="Search name or tel" onChange={onChangeSearch} />
          <Select style={{ width: 150 }} placeholder="Category" allowClear onChange={handleCategory}>
            {category?.map((item, index) => (
              <Select.Option key={index} value={item.Id + ""}>
                {item.Name}
              </Select.Option>
            ))}
          </Select>
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
            key: "CategoryName",
            title: "CategoryName",
            dataIndex: "CategoryName",
          },
          {
            key: "Description",
            title: "Description",
            dataIndex: "Description",
          },
          {
            key: "Price",
            title: "Price",
            dataIndex: "Price",
          },
          {
            key: "TotalHour",
            title: "TotalHour",
            dataIndex: "TotalHour",
          },
          {
            key: "Image",
            title: "Image",
            dataIndex: "Image",
            render: (image) => (image ? <Image width={60} height={60} src={Config.IMAGE_PATH + image} /> : <div style={{ width: 60, height: 60, backgroundColor: "#EEE" }} />),
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
      <Modal maskClosable={false} open={visible} onCancel={onCloseForm} title={formRef.getFieldValue("Id") ? "Edit Course" : "New Course"} footer={null}>
        <p>{formRef.getFieldValue("OldImage") + ""}</p>
        <Form form={formRef} layout="horizontal" labelCol={{ span: 7 }} wrapperCol={{ span: 17 }} onFinish={onFinish}>
          <Form.Item label="Course Name" name="Name" rules={[{ required: "true", message: "Please fill in course name!" }]}>
            <Input placeholder="Course Name" />
          </Form.Item>
          <Form.Item label="Category" name="CategoryId" rules={[{ required: "true", message: "Please fill in category!" }]}>
            <Select style={{ width: "100%" }} placeholder="Category" allowClear>
              {category?.map((item, index) => (
                <Select.Option key={index} value={item.Id + ""}>
                  {item.Name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Description" name="Description">
            <Input.TextArea placeholder="Description" />
          </Form.Item>
          <Form.Item label="Price" name="Price">
            <InputNumber style={{ width: "100%" }} placeholder="Price" />
          </Form.Item>
          <Form.Item label="Total Hour" name="TotalHour">
            <InputNumber style={{ width: "100%" }} placeholder="Total Hour" />
          </Form.Item>
          <Form.Item label="IsActive" name="IsActive" rules={[{ required: "true", message: "Please fill in status!" }]}>
            <Select style={{ width: "100%" }} placeholder="Status" allowClear>
              <Select.Option value={"1"}>Active</Select.Option>
              <Select.Option value={"0"}>InActive</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Image" name="Image">
            {/* vannak */}
            <Upload
              // action={null} //"https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
              customRequest={(options) => {
                options.onSuccess();
                // options.onProgress({ percent: 0 });
                // options.onProgress({ percent: 100 });
              }}
              fileList={fileList}
              onChange={({ fileList }) => {
                if (fileList.length === 0) {
                  setIsRemoveFile(true);
                }
                setFileList(fileList);
              }}
              accept=".png, .jpg, .jpeg"
              listType="picture-card" //"picture" //"picture-circle" //picture-card"
              maxCount={1}
              // defaultFileList={defaultFileList}
              onPreview={async (file) => {
                if (!file.url && !file.preview) {
                  file.preview = await getBase64(file.originFileObj);
                }
                setPreviewImage(file.url || file.preview);
                setPreviewOpen(true);
              }}
            >
              + Upload
            </Upload>
            {previewImage && (
              <Image
                wrapperStyle={{
                  display: "none",
                }}
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                  afterOpenChange: (visible) => !visible && setPreviewImage(""),
                }}
                src={previewImage}
              />
            )}
          </Form.Item>

          <div style={{ textAlign: "right" }}>
            <Space>
              <Button onClick={() => setVisible(false)}>Cancel</Button>
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

export default AdminCoursePage;
