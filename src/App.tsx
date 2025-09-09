import React, { useState } from "react";
import axios from "axios";
import {
  Layout,
  Button,
  Typography,
  message,
  Input,
  Card,
  Spin,
  Switch,
  Form,
  Row,
  Col,
} from "antd";

const { Header, Content } = Layout;
const { Title } = Typography;

export interface IGreenWingDetails {
  returnUrl: string;
  greenWingUserId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  emailOptIn: boolean;
  smsOptIn: boolean;
  profileCode: string;
  accountCode: string;
  portalId?: number;
  baseUrl?: string;
  isWebStoreUser?: boolean;
  localeCode?: string;
  storeCode?: string;
}

export interface IGreenWingRequestModel {
  greenWingRequestDetails: IGreenWingDetails;
}

export interface IGreenWingUserModel {
  userName: string | null;
  loginAccessToken: string | null;
  isNewUser: boolean;
  isSuccess: boolean;
  hasError: boolean;
  errorMessage: string | null;
}

export interface IGreenWingUserResponseModel {
  greenWingResponseDetails: IGreenWingUserModel;
}

export interface IResponseModel {
  status: string;
  message: string;
  data: IGreenWingUserResponseModel;
}

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<IGreenWingDetails>({
    returnUrl: "https://eprohub.gwpunchout.com/returnurl/",
    greenWingUserId: "C21652",
    firstName: "Abhi",
    lastName: "Raut",
    email: "abhi.r@test.com",
    phoneNumber: "1112223333",
    emailOptIn: false,
    smsOptIn: false,
    profileCode: "",
    accountCode: "CustomPrice",
    // portalId: 0,
    // baseUrl: "http://localhost:3000",
    // isWebStoreUser: true,
    // localeCode: "en-US",
    // storeCode: "KR",
  });

  const handleChange = (field: keyof IGreenWingDetails, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const punchInHandler = async () => {
    setLoading(true);

    const payload: IGreenWingRequestModel = {
      greenWingRequestDetails: formData,
    };

    try {
      const response = await axios.post<IResponseModel>(
        "http://localhost:3000/api/kleen-rite/greenwing/punch-in/initiate-session",
        payload,
        {
          headers: {
            ClientSecret: "550e8400-e29b-41d4-a716-446655440000",
          },
        }
      );

      const userData = response.data.data.greenWingResponseDetails;

      if (userData?.loginAccessToken) {
        message.success("Punch in successful!");
        validateTokenHandler(userData.loginAccessToken);
      } else {
        message.error(userData?.errorMessage || "Punch in failed!");
      }
    } catch (error) {
      console.error("Error during punch in:", error);
      message.error("Punch in failed!");
    } finally {
      setLoading(false);
    }
  };

  const validateTokenHandler = (token: string) => {
    const products = [
      {
        SKU: "KW55",
        AddOnSKUListModel: [],
        PersonalizedDetails: [],
        ProductType: "SimpleProduct",
        AddToCartChildItems: [],
        CustomData: [],
        GroupCode: "",
        AdditionalCost: [],
        Quantity: 1,
      },
      {
        SKU: "SNCP21953VI",
        AddOnSKUListModel: [],
        PersonalizedDetails: [],
        ProductType: "SimpleProduct",
        AddToCartChildItems: [],
        CustomData: [],
        GroupCode: "",
        AdditionalCost: [],
        Quantity: 1,
      },
      {
        SKU: "140444",
        AddOnSKUListModel: [],
        PersonalizedDetails: [],
        ProductType: "SimpleProduct",
        AddToCartChildItems: [],
        CustomData: [],
        GroupCode: "",
        AdditionalCost: [],
        Quantity: 2,
      },
    ];

    const payload = {
      LoginToken: token,
      GreenWingDetails: {
        Type: "SetupRequest", // EditRequest or SetupRequest
        ReturnURL: "https://eprohub.gwpunchout.com/returnurl/",
        CustomerId: "C21652",

        SelectedItem: {
          item: {
            SKU: "140444",
            Name: "Sample Product Name",
            CategoryCode: "SampleCategory",
            CategoryName: "Sample Category",
          },
        },

        CartData: {
          item: products,
        },

        // User: {
        //   Email: "john.smith@acmetestcompany.org",
        //   Username: "john.smith@acmetestcompany.org",
        // },
      },
    };

    axios
      .post(
        "http://localhost:3000/api/kleen-rite/greenwing/punch-in/validate-token",
        payload
      )
      .then((response: any) => {
        const { data } = response?.data;
        console.log({ response });
        const navigationURL = data?.GWTSSO?.LoggedInURL;
        console.log("url", navigationURL);

        if (navigationURL) {
          //navigate to znode page
          window.location.href = navigationURL;
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
      <Header
        style={{ background: "#001529", display: "flex", alignItems: "center" }}
      >
        <Title level={3} style={{ color: "white", margin: 0 }}>
          GreenWing Login Portal
        </Title>
      </Header>

      <Content
        style={{ padding: "2rem", display: "flex", justifyContent: "center" }}
      >
        <Card style={{ width: 800, padding: "1.5rem" }}>
          <Title level={4}>Punch In Details</Title>
          <Form layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Return URL">
                  <Input
                    value={formData.returnUrl}
                    onChange={(e) => handleChange("returnUrl", e.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="GreenWing User ID">
                  <Input
                    value={formData.greenWingUserId}
                    onChange={(e) =>
                      handleChange("greenWingUserId", e.target.value)
                    }
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="First Name">
                  <Input
                    value={formData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Last Name">
                  <Input
                    value={formData.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Email">
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Phone Number">
                  <Input
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      handleChange("phoneNumber", e.target.value)
                    }
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Email Opt-In">
                  <Switch
                    checked={formData.emailOptIn}
                    onChange={(checked) => handleChange("emailOptIn", checked)}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="SMS Opt-In">
                  <Switch
                    checked={formData.smsOptIn}
                    onChange={(checked) => handleChange("smsOptIn", checked)}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Profile Code">
                  <Input
                    value={formData.profileCode}
                    onChange={(e) =>
                      handleChange("profileCode", e.target.value)
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Account Code">
                  <Input
                    value={formData.accountCode}
                    onChange={(e) =>
                      handleChange("accountCode", e.target.value)
                    }
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Portal ID">
                  <Input
                    type="number"
                    value={formData.portalId}
                    onChange={(e) =>
                      handleChange("portalId", Number(e.target.value))
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Base URL">
                  <Input
                    value={formData.baseUrl}
                    onChange={(e) => handleChange("baseUrl", e.target.value)}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Is Web Store User">
                  <Switch
                    checked={formData.isWebStoreUser}
                    onChange={(checked) =>
                      handleChange("isWebStoreUser", checked)
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Locale Code">
                  <Input
                    value={formData.localeCode}
                    onChange={(e) => handleChange("localeCode", e.target.value)}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Store Code">
                  <Input
                    value={formData.storeCode}
                    onChange={(e) => handleChange("storeCode", e.target.value)}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Button
              type="primary"
              block
              size="large"
              onClick={punchInHandler}
              loading={loading}
            >
              {loading ? "Processing..." : "Punch In"}
            </Button>
          </Form>
        </Card>
      </Content>

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
    </Layout>
  );
};

export default App;
