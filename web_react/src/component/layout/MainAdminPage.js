import { Button, Result, Spin } from "antd";
import React from "react";

const MainAdminPage = ({ loading = false, children }) => {
  // const statusError = 550;
  // return <Result status="405" title="500" subTitle="Sorry, something went wrong." extra={<Button type="primary">Back Home</Button>} />;
  // return <Result status="401" title="401" subTitle="Sorry, something went wrong." extra={<Button type="primary">Back Home</Button>} />;
  // return <Result status="404" title="504" subTitle="Sorry, something went wrong." extra={<Button type="primary">Back Home</Button>} />;
  return (
    <div>
      <Spin spinning={loading}>
        <div>{children}</div>
      </Spin>
    </div>
  );
};

export default MainAdminPage;
