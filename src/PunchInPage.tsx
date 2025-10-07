import React, { useState } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";
import {
  Layout,
  Button,
  Typography,
  message,
  Card,
  Row,
  Col,
  Spin,
  notification,
} from "antd";
import { APPLICATION_URL } from "./constant";

const { Content } = Layout;
const { Title } = Typography;

type NotificationType = "success" | "info" | "warning" | "error";

const PunchInPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [editDisabled, setEditDisabled] = useState(false);

  // ✅ Must render `contextHolder` inside JSX return (top level)
  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (
    type: NotificationType,
    messageText: string
  ) => {
    api[type]({
      message: messageText,
      placement: "topRight", // optional for positioning
    });
  };

  const [sessionPayload, setSessionPayload] = useState(
    JSON.stringify(
      {
        greenWingUserDetails: {
          provider: "GreenWing",
          returnUrl: "https://eprohub.gwpunchout.com/returnurl/",
          externalUserId: "C21652",
          firstName: "Abhi",
          lastName: "Raut",
          email: "test-user+1@yopmail.com",
          phoneNumber: "1112223333",
          emailOptIn: false,
          smsOptIn: false,
          profileCode: "",
          accountCode: "CustomPrice",
        },
      },
      null,
      2
    )
  );

  const [loginPayload, setLoginPayload] = useState(
    JSON.stringify(
      {
        buyerCookie: "test123",
        loginToken: "<ACCESS_TOKEN_FROM_INITIATE>",
        punchInDetails: {
          type: "EditRequest",
          returnUrl: "https://eprohub.gwpunchout.com/returnurl/",
          externalUserId: "C21652",
          selectedItem: {
            sku: "499",
            name: "Black + Decker 2.4 Amp Corded 5 in Random Orbit Sander",
            categoryCode: "1186",
            categoryName: "Sample Category",
          },
          cartData: [
            {
              sku: "KW55",
              quantity: 1,
              price: 0,
              unitPrice: 0,
              uom: "EA",
              addOnSkuListModel: [],
            },
            {
              sku: "SNCP21953VI",
              quantity: 1,
              price: 0,
              unitPrice: 0,
              uom: "EA",
              addOnSkuListModel: [],
            },
            {
              sku: "140444",
              quantity: 2,
              price: 0,
              unitPrice: 0,
              uom: "EA",
              addOnSkuListModel: [],
            },
          ],
        },
      },
      null,
      2
    )
  );

  const runPunchInFlow = async () => {
    setLoading(true);
    setEditDisabled(true);

    try {
      const parsedSession = JSON.parse(sessionPayload);
      const initiateResponse = await axios.post(
        `${APPLICATION_URL}/api/kleen-rite/greenwing/punch-in/initiate-session`,
        parsedSession,
        {
          headers: { ClientSecret: "550e8400-e29b-41d4-a716-446655440000" },
        }
      );

      console.log("initiateResponse", initiateResponse);
      const initiateDataPart = initiateResponse?.data?.data;
      if (initiateDataPart?.hasError) {
        openNotificationWithIcon(
          "error",
          initiateDataPart?.errorMessage || "Something went wrong!"
        );
        setEditDisabled(false);
        return;
      }

      const token = initiateResponse.data?.data?.loginAccessToken;
      if (!token) throw new Error("No token received from initiate session");

      message.success("Session initiated successfully!");

      const updatedLoginPayload = loginPayload.replace(
        "<ACCESS_TOKEN_FROM_INITIATE>",
        token
      );
      setLoginPayload(updatedLoginPayload);
      const parsedLogin = JSON.parse(updatedLoginPayload);

      const loginResponse = await axios.post(
        `${APPLICATION_URL}/api/kleen-rite/greenwing/punch-in/login`,
        parsedLogin
      );

      console.log("loginResponse", loginResponse);
      const dataPart = loginResponse?.data?.data;
      if (dataPart?.hasError) {
        openNotificationWithIcon(
          "error",
          dataPart?.errorMessage || "Something went wrong!"
        );
        setEditDisabled(false);
        return;
      }

      const navigationURL = loginResponse.data?.data?.loggedInURL;
      if (navigationURL) {
        openNotificationWithIcon("success", "Login successful!");
        window.location.href = navigationURL;
      } else {
        openNotificationWithIcon(
          "warning",
          "Login successful, but no redirect URL!"
        );
        setEditDisabled(false);
      }
    } catch (error: any) {
      console.error("PunchIn Flow Failed:", error);
      openNotificationWithIcon(
        "error",
        error?.message || "Something went wrong!"
      );
      setEditDisabled(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ✅ Must render here */}
      {contextHolder}

      <Layout style={{ minHeight: "100vh", padding: "2rem" }}>
        <Content>
          <Row gutter={[24, 24]}>
            <Col span={12}>
              <Card title={<Title level={4}>Initiate Session Payload</Title>}>
                <Editor
                  height="400px"
                  defaultLanguage="json"
                  value={sessionPayload}
                  onChange={(value) => setSessionPayload(value || "")}
                  options={{
                    minimap: { enabled: false },
                    readOnly: editDisabled,
                    domReadOnly: editDisabled,
                    cursorStyle: "block",
                  }}
                />
              </Card>
            </Col>

            <Col span={12}>
              <Card title={<Title level={4}>Login Payload</Title>}>
                <Editor
                  height="400px"
                  defaultLanguage="json"
                  value={loginPayload}
                  onChange={(value) => setLoginPayload(value || "")}
                  options={{
                    minimap: { enabled: false },
                    readOnly: editDisabled,
                    domReadOnly: editDisabled,
                    cursorStyle: "block",
                  }}
                />
              </Card>
            </Col>
          </Row>

          <div style={{ marginTop: "2rem", textAlign: "center" }}>
            <Button
              type="primary"
              size="large"
              onClick={runPunchInFlow}
              loading={loading}
              disabled={loading}
            >
              Run Punch In Flow
            </Button>
          </div>

          {loading && (
            <div
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <Spin size="large" />
            </div>
          )}
        </Content>
      </Layout>
    </>
  );
};

export default PunchInPage;
