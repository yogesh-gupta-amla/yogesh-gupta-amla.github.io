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
} from "antd";

const { Content } = Layout;
const { Title } = Typography;

const PunchInPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [editDisabled, setEditDisabled] = useState(false);

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
      // Step 1: Initiate Session
      const parsedSession = JSON.parse(sessionPayload);
      const initiateResponse = await axios.post(
        "http://localhost:3000/api/kleen-rite/greenwing/punch-in/initiate-session",
        parsedSession,
        {
          headers: { ClientSecret: "550e8400-e29b-41d4-a716-446655440000" },
        }
      );

      const token = initiateResponse.data?.data?.loginAccessToken;
      if (!token) throw new Error("No token received from initiate session");

      message.success("Session initiated successfully!");

      // Step 2: Replace token and call login
      const updatedLoginPayload = loginPayload.replace(
        "<ACCESS_TOKEN_FROM_INITIATE>",
        token
      );
      setLoginPayload(updatedLoginPayload); // visually show token
      const parsedLogin = JSON.parse(updatedLoginPayload);

      const loginResponse = await axios.post(
        "http://localhost:3000/api/kleen-rite/greenwing/punch-in/login",
        parsedLogin
      );

      const navigationURL = loginResponse.data?.data?.loggedInURL;
      if (navigationURL) {
        message.success("Login successful! Redirecting...");
        window.location.href = navigationURL;
      } else {
        message.warning("Login successful, but redirect URL missing!");
      }
    } catch (error: any) {
      console.error("PunchIn Flow Failed:", error);
      message.error(error?.message || "Something went wrong!");
      setEditDisabled(false);
    } finally {
      setLoading(false);
    }
  };

  return (
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
                  domReadOnly: editDisabled, // fully disable typing and selection
                  cursorStyle: "block",
                }}
              />
            </Card>
          </Col>

          <Col span={12}>
            <Card title={<Title level={4}>Login Payload</Title>}>
              <p>
                <i>{"// SetupRequest or EditRequest"}</i>
              </p>
              <Editor
                height="400px"
                defaultLanguage="json"
                value={loginPayload}
                onChange={(value) => setLoginPayload(value || "")}
                options={{
                  minimap: { enabled: false },
                  readOnly: editDisabled,
                  domReadOnly: editDisabled, // prevents typing & focus
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
  );
};

export default PunchInPage;
