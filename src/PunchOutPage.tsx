// PunchOutPage.tsx
import React, { useState } from "react";
import axios from "axios";
import { Layout, Typography, Button, Card, message, Space } from "antd";
import Editor from "@monaco-editor/react";

const { Header, Content } = Layout;
const { Title } = Typography;

const PunchOutPage: React.FC = () => {
  const [jsonInput, setJsonInput] = useState<string>(
    JSON.stringify(
      {
        LoginToken: "sample-token",
        GreenWingDetails: {
          Type: "PunchOutRequest",
          CustomerId: "C21652",
          CartData: {
            item: [
              { SKU: "KW55", Quantity: 1 },
              { SKU: "SNCP21953VI", Quantity: 1 },
            ],
          },
        },
      },
      null,
      2
    )
  );

  const handlePunchOut = async () => {
    try {
      const parsedData = JSON.parse(jsonInput);

      const response = await axios.post(
        "http://localhost:3000/api/kleen-rite/greenwing/punch-out",
        parsedData
      );

      message.success("Punch Out successful!");
      console.log("Response:", response.data);
    } catch (error: any) {
      console.error("Punch Out failed:", error);
      message.error("Invalid JSON or request failed!");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: "2rem" }}>
        <Card style={{ width: "100%", padding: "1.5rem" }}>
          <Title level={4}>Punch Out JSON</Title>

          <Editor
            height="400px"
            defaultLanguage="json"
            value={jsonInput}
            onChange={(value) => setJsonInput(value || "")}
            options={{
              minimap: { enabled: false },
              formatOnPaste: true,
              formatOnType: true,
              fontSize: 14,
              wordWrap: "on",
            }}
          />

          <Space
            direction="vertical"
            style={{
              marginTop: "1rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              type="primary"
              size="large"
              style={{ marginTop: "1rem" }}
              onClick={handlePunchOut}
            >
              Punch Out
            </Button>
          </Space>
        </Card>
      </Content>
    </Layout>
  );
};

export default PunchOutPage;
