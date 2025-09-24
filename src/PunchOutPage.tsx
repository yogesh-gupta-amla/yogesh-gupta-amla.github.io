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
        greenWingPreOrderProcessDetails: {
          greenWingUserID: "C216534",
          email: "abhi.raut@yopmail.com",
          shipTo: {
            displayName: "Shipping",
            firstName: "a",
            lastName: "r",
            phoneNumber: 123123123,
            streetAddress1: "aaa",
            streetAddress2: "aa",
            cityName: "NewYork",
            stateCode: "NY",
            postalCode: "10001",
            countryCode: "US",
          },
          billTo: {
            displayName: "Billing",
            firstName: "a",
            lastName: "r",
            phoneNumber: 123123123,
            streetAddress1: "aaa",
            streetAddress2: "aa",
            cityName: "NewYork",
            stateCode: "NY",
            postalCode: "10001",
            countryCode: "US",
          },
          cartNumber: "C-24092025-6190",
          cartData: {
            item: [
              {
                sku: "KW55",
                addOnSkuListModel: [],
                personalizedDetails: [],
                productType: "SimpleProduct",
                addToCartChildItems: [],
                customData: [],
                groupCode: "",
                additionalCost: [],
                quantity: 1,
              },
              {
                sku: "SNCP21953VI",
                addOnSkuListModel: [],
                personalizedDetails: [],
                productType: "SimpleProduct",
                addToCartChildItems: [],
                customData: [],
                groupCode: "",
                additionalCost: [],
                quantity: 1,
              },
              {
                sku: "140444",
                addOnSkuListModel: [],
                personalizedDetails: [],
                productType: "SimpleProduct",
                addToCartChildItems: [],
                customData: [],
                groupCode: "",
                additionalCost: [],
                quantity: 2,
              },
            ],
          },
          paymentCode: "PurchaseOrder",
          portalCode: "KleenRite",
          portalId: 10,
          localeCode: "en-Us",
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
        "http://localhost:3000/api/kleen-rite/greenwing/create-order",
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
          <Title level={4}>Place Order Request Body</Title>

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
              Place Order
            </Button>
          </Space>
        </Card>
      </Content>
    </Layout>
  );
};

export default PunchOutPage;
