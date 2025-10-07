import React, { useState } from "react";
import { Button, Layout, Space, Typography } from "antd";
import PunchInPage from "./PunchInPage";
import PunchOutPage from "./PunchOutPage";

const { Header } = Layout;
const { Title } = Typography;

const App: React.FC = () => {
  // default page is "punchin"
  const [activePage, setActivePage] = useState<"punchin" | "placeOrder">(
    "punchin"
  );

  return (
    <Layout>
      <Header
        style={{
          background: "#001529",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 1rem",
        }}
      >
        <Title level={3} style={{ color: "white", margin: 0 }}>
          GreenWing Login Portal
        </Title>

        {/* Navigation Buttons */}
        <Space>
          <Button
            type={activePage === "punchin" ? "primary" : "default"}
            onClick={() => setActivePage("punchin")}
          >
            Punch In
          </Button>

          <Button
            type={activePage === "placeOrder" ? "primary" : "default"}
            onClick={() => setActivePage("placeOrder")}
          >
            Place Order
          </Button>
        </Space>
      </Header>

      {/* Page content based on ternary */}
      <div style={{ padding: "1rem" }}>
        {activePage === "punchin" ? <PunchInPage /> : <PunchOutPage />}
      </div>
    </Layout>
  );
};

export default App;
