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
        // shipTo: {
        //   name: "Branch Office",
        //   firstName: "dipesh",
        //   lastName: "dhawan",
        //   street: "1 West Main St",
        //   city: "1 West Main St",
        //   state: "1 West Main St",
        //   postalCode: "1 West Main St",
        //   country: "United States",
        // },
        // billTo: {
        //   name: "Branch Office",
        //   firstName: "dipesh",
        //   lastName: "dhawan",
        //   street: "1 West Main St",
        //   city: "1 West Main St",
        //   state: "1 West Main St",
        //   postalCode: "1 West Main St",
        //   country: "United States",
        // },
        phoneNumber: "111-222-3333",
        firstName: "dipesh",
        lastName: "dhawan",
        user: {
          email: "dipesh+001@yopmail.com",
          userName: "dipesh+001@yopmail.com",
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
        payload,
        {
          headers: {
            ClientSecret: "550e8400-e29b-41d4-a716-446655440000",
          },
        }
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
      .then((response: any) => {
        const { data } = response?.data;
        console.log({ response });
        if (data?.user?.isVerified) {
          const finalUrl = `http://localhost:3000/validate-sso?loginToken=${data?.token}&redirectUrl=${data?.redirect}&cartId=${data?.cartData?.CartId}&cartNumber=${data?.cartData?.CartNumber}`;
          console.log("url", finalUrl);
          window.location.href = finalUrl;
        }
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
        <Button
          type="primary"
          size="large"
          onClick={punchInHandler}
          style={{ marginTop: "2rem" }}
          loading={loading}
        >
          Punch In
        </Button>
      </Content>
    </Layout>
  );
}

export default App;

// {
//     "token": "hZZnR4it28f4ppLj1ERfxG6ysqDYJY0%2bsGzb29%2bxeMfX%2bXFbGpdyOTgQVzXfroHoU4i5XKx%2bBxFFAc1LJJOg0Kh5JUyM%2b%2bIw21wbOcTWJLHXBbd6yRJvLHh6uTuGNy6Wwc6p%2bcGY8aypoqjiGnn3So7ncdWfRMUWiaQ%2fLoeAatE%3d",
//     "redirect": "/cart",
//     "cartData": {
//         "CartId": "a2204e3e-f36b-1410-8105-0052b4902e8f",
//         "CartItemId": "ea204e3e-f36b-1410-8105-0052b4902e8f",
//         "Status": true,
//         "CartNumber": "C-04092025-11520"
//     },
//     "user": {
//         "userId": 5016,
//         "accountId": 0,
//         "accountCode": null,
//         "accountName": null,
//         "aspNetUserId": "9eabf36c-bd59-48e7-a689-250c253974ff",
//         "firstName": "John",
//         "lastName": "Smith",
//         "roleName": "Customer",
//         "phoneNumber": "111-222-3333",
//         "email": "ankittestuser+4@yopmail.com",
//         "isActive": false,
//         "externalId": null,
//         "userName": "ankittestuser+4@yopmail.com",
//         "isVerified": true,
//         "emailOptIn": false,
//         "smsOptIn": false,
//         "customerPaymentGUID": null,
//         "perOrderLimit": 0,
//         "annualOrderLimit": 0,
//         "annualBalanceOrderAmount": 0,
//         "publishCatalogId": 8,
//         "catalogCode": "KleenRiteTestCatalog",
//         "profiles": [],
//         "accountExternalId": null,
//         "custom1": null,
//         "custom2": null,
//         "custom3": null,
//         "custom4": null,
//         "custom5": null
//     }
// }
