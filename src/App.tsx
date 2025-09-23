import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import PunchInPage from "./PunchInPage";
import PunchOutPage from "./PunchOutPage";
import { Button, Layout, Space, Typography } from "antd";
const { Header } = Layout;
const { Title } = Typography;

const App: React.FC = () => {
  return (
    <Router>
      <div>
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

          {/* Navigation */}
          <Space>
            <Link to="/punchin">
              <Button type="primary">Punch In</Button>
            </Link>
            <Link to="/placeOrder">
              <Button type="primary">Place Order</Button>
            </Link>
          </Space>
        </Header>
      </div>

      <Routes>
        <Route path="/punchin" element={<PunchInPage />} />
        <Route path="/placeOrder" element={<PunchOutPage />} />
      </Routes>
    </Router>
  );
};

export default App;
