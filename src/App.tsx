import React, { useState } from "react";
import axios from "axios";
import { Layout, Button, Spin, Typography, message } from "antd";

const { Header, Content } = Layout;
const { Title } = Typography;

type User = {
  id: number;
  name: string;
};

function App() {
  const [loading, setLoading] = useState(false);

  const punchInHandler = () => {
    setLoading(true);

    const payload = {
      greenWingDetails: {
        returnUrl: "https://eprohub.gwpunchout.com/returnurl/",
        greenWingUserId: "C21652",
        shipTo: {
          name: "Branch Office",
          firstName: "John",
          lastName: "Smith",
          street: "1 West Main St",
          city: "1 West Main St",
          state: "1 West Main St",
          postalCode: "1 West Main St",
          country: "United States",
        },
        billTo: {
          name: "Branch Office",
          firstName: "John",
          lastName: "Smith",
          street: "1 West Main St",
          city: "1 West Main St",
          state: "1 West Main St",
          postalCode: "1 West Main St",
          country: "United States",
        },
        phoneNumber: "111-222-3333",
        firstName: "John",
        lastName: "Smith",
        user: {
          email: "ankittestuser+12@yopmail.com",
          userName: "ankittestuser+12@yopmail.com",
        },
        emailOptIn: false,
        smsOptIn: false,
        profileCode: "nullorEmpty",
        accountCode: "KleenRiteAccount",
      },
    };

    axios
      .post<User[]>(
        "http://localhost:3000/api/kleen-rite/greenwing/punch-in/initiate-session",
        payload
      )
      .then((response: { data: any }) => {
        console.log(response.data);
        validateTokenHandler(
          response?.data?.data?.LoginToken?.loginToken || ""
        );
        message.success("Punch in successful!");
      })
      .catch((error: any) => {
        console.error("Error fetching users:", error);
        message.error("Punch in failed!");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const validateTokenHandler = (token: string) => {
    const payload = {
      token: token,
      domainName: "http://localhost:3000",
    };

    axios
      .post<User[]>(
        "http://localhost:3000/api/kleen-rite/greenwing/punch-in/validate-token",
        payload
      )
      .then((response: { data: any }) => {
        console.log(response.data);
      })
      .catch((error: any) => {
        console.error("Error fetching users:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Header */}
      <Header
        style={{ background: "#001529", display: "flex", alignItems: "center" }}
      >
        <Title level={3} style={{ color: "white", margin: 0 }}>
          Greenwing
        </Title>
      </Header>

      {/* Content */}
      <Content style={{ padding: "2rem", textAlign: "center" }}>
        <Spin spinning={loading} tip="Processing...">
          <Button
            type="primary"
            size="large"
            onClick={punchInHandler}
            style={{ marginTop: "2rem" }}
          >
            Punch In
          </Button>
        </Spin>
      </Content>
    </Layout>
  );
}

export default App;
