import React, { useEffect, useState } from "react";
import { Button, Layout, Space, Typography, Select } from "antd";
import PunchInPage from "./PunchInPage";
import PlaceOrder from "./PlaceOrder";

const { Header } = Layout;
const { Title } = Typography;
const { Option } = Select;

// Environment options
const ENVIRONMENTS = [
  {
    label: "NPR",
    value: "https://webstore-klrt-npr.amla.io",
  },
  {
    label: "NP",
    value: "https://webstore-klrt-np.znodecorp.com",
  },
  {
    label: "Dev",
    value: "https://webstore-klrt-dv.amla.io/",
  },
  {
    label: "Localhost",
    value: "http://localhost:3000",
  },
];

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<"punchin" | "placeOrder">(
    "punchin"
  );

  // persisted environment
  const [environment, setEnvironment] = useState<string>(
    localStorage.getItem("selectedEnvironment") || ENVIRONMENTS[0].value
  );

  // Save to localStorage whenever environment changes
  useEffect(() => {
    localStorage.setItem("selectedEnvironment", environment);
  }, [environment]);

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

        {/* Right side controls */}
        <Space>
          {/* Environment Dropdown */}
          <Select
            value={environment}
            onChange={(val) => setEnvironment(val)}
            style={{ width: 200 }}
            dropdownMatchSelectWidth={false}
          >
            {ENVIRONMENTS.map((env) => (
              <Option key={env.value} value={env.value}>
                {env.label}
              </Option>
            ))}
          </Select>

          {/* Navigation Buttons */}
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

      {/* Page content */}
      <div style={{ padding: "1rem" }}>
        {activePage === "punchin" ? (
          <PunchInPage environment={environment} />
        ) : (
          <PlaceOrder environment={environment} />
        )}
      </div>
    </Layout>
  );
};

export default App;
