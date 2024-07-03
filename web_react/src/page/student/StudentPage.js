import { Button, Flex } from "antd";
import { SaveOutlined } from "@ant-design/icons";
const StudentPage = () => {
  return (
    <div>
      <h1>StudentPage</h1>
      <Flex gap={10}>
        <Button> default </Button>
        <Button type="primary"> Primary</Button>
        <Button type="dashed"> dashed</Button>
        <Button type="primary" disabled>
          disabled
        </Button>
        <Button danger>danger</Button>
        <Button style={{ backgroundColor: "green", color: "#FFF", marginLeft: 15 }}>danger</Button>
        <Button type="primary" shape="circle">
          A
        </Button>
        <Button loading={true}>Loadding...</Button>
        <Button type="primary" shape="circle">
          <SaveOutlined />
        </Button>
        <Button icon={<SaveOutlined />} iconPosition="end">
          Button Test
        </Button>
      </Flex>
    </div>
  );
};

export default StudentPage;
