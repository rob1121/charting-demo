"use strict";
import * as React from "react";
import {
  Layout,
  Menu,
  Breadcrumb,
  Icon,
  Card,
  DatePicker,
  Form,
  Switch,
} from "antd";
import {
  LineChart,
  XAxis,
  Tooltip,
  Legend,
  Line,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { BLUE, RED, ITEM_LAYOUT, FROM, TO } from "./DashboardApp.constant";

const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;
const { RangePicker } = DatePicker;

require("antd/dist/antd.less");
require("./DashboardApp.less");

export default class DashboardApp extends React.Component {
  state = {
    collapsed: false,
    data: [],
    showOptins: true,
    showRecipients: true,
  };

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  onShowOptinsChange = () => {
    this.setState({ showOptins: !this.state.showOptins });
  };

  onShowRecipientsChange = () => {
    this.setState({ showRecipients: !this.state.showRecipients });
  };

  onDateChange = async (dateRange) => {
    const dateStart = dateRange[FROM].format("YYYY-MM-DD");
    const dateEnd = dateRange[TO].format("YYYY-MM-DD");
    const params = `from=${dateStart}&to=${dateEnd}`;

    const { data: optinsData } = await axios.get(
      `/api/reports/optins.json?${params}`
    );

    const { data: recipientsData } = await axios.get(
      `/api/reports/recipients.json?${params}`
    );

    const data = optinsData.map((optin, index) => ({
      date: optin.date,
      optins: optin.count,
      recipients: recipientsData[index].count,
    }));

    this.setState({ data });
  };

  render() {
    const { showOptins, showRecipients, collapsed, data } = this.state;

    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
            <Menu.Item key="1">
              <Icon type="pie-chart" />
              <span>Reports</span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="desktop" />
              <span>Option 2</span>
            </Menu.Item>
            <SubMenu
              key="sub1"
              title={
                <span>
                  <Icon type="user" />
                  <span>User</span>
                </span>
              }
            >
              <Menu.Item key="3">Tom</Menu.Item>
              <Menu.Item key="4">Bill</Menu.Item>
              <Menu.Item key="5">Alex</Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub2"
              title={
                <span>
                  <Icon type="team" />
                  <span>Team</span>
                </span>
              }
            >
              <Menu.Item key="6">Team 1</Menu.Item>
              <Menu.Item key="8">Team 2</Menu.Item>
            </SubMenu>
            <Menu.Item key="9">
              <Icon type="file" />
              <span>File</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: "#fff", padding: 0 }} />
          <Content style={{ margin: "0 16px" }}>
            <Breadcrumb style={{ margin: "16px 0" }}>
              <Breadcrumb.Item>Reports</Breadcrumb.Item>
              <Breadcrumb.Item>Message Receipts & Optins</Breadcrumb.Item>
            </Breadcrumb>
            <Card className="card-form">
              <Form id="chart-form">
                <Form.Item labelCol={ITEM_LAYOUT} label="Date range" colon>
                  <RangePicker size="small" onChange={this.onDateChange} />
                </Form.Item>
                <Form.Item labelCol={ITEM_LAYOUT} label="Show optins" colon>
                  <Switch
                    size="small"
                    defaultChecked
                    onChange={this.onShowOptinsChange}
                  />
                </Form.Item>
                <Form.Item labelCol={ITEM_LAYOUT} label="Show recipients" colon>
                  <Switch
                    size="small"
                    defaultChecked
                    onChange={this.onShowRecipientsChange}
                  />
                </Form.Item>
              </Form>
            </Card>
            <Card className="card-graph">
              <ResponsiveContainer width={"99%"} height={200}>
                <LineChart
                  width={730}
                  height={250}
                  data={data}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10 }}
                    dataKey="date"
                  />
                  <Tooltip />
                  <Legend
                    iconType="plainline"
                    iconSize={20}
                    align="left"
                    verticalAlign="top"
                  />
                  {showOptins && (
                    <Line
                      strokeWidth={2}
                      dot={false}
                      type="linear"
                      dataKey="optins"
                      stroke={BLUE}
                    />
                  )}
                  {showRecipients && (
                    <Line
                      strokeWidth={2}
                      dot={false}
                      type="linear"
                      dataKey="recipients"
                      stroke={RED}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Content>
          <Footer style={{ textAlign: "center" }}>ShopMessage ©2018</Footer>
        </Layout>
      </Layout>
    );
  }
}
