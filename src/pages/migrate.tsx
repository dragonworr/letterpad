import withAuthCheck from "../hoc/withAuth";
import CustomLayout from "@/components/layouts/Layout";
import Head from "next/head";
import { Input, PageHeader, Form, Button, Upload } from "antd";
import { Content } from "antd/lib/layout/layout";
import nextConfig from "next.config";
import { getDateTime } from "@/graphql/resolvers/helpers";
import { UploadOutlined } from "@ant-design/icons";

const Migrate = () => {
  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <PageHeader className="site-page-header" title="Migrate"></PageHeader>
      <Content style={{ margin: "16px 0px 0" }}>
        <div className="site-layout-background" style={{ padding: 24 }}>
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
            layout="horizontal"
            size={"small"}
          >
            <Form.Item label="Export Data">
              <Button
                onClick={() => {
                  fetch(nextConfig.basePath + "/api/export")
                    .then(res => res.blob())
                    .then(download);
                }}
              >
                Download
              </Button>
            </Form.Item>
            <Form.Item label="Import Data">
              <Upload
                name="import"
                accept=".json"
                action={nextConfig.basePath + "/api/import"}
              >
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>
          </Form>
        </div>
      </Content>
    </>
  );
};

const MediaWithAuth = withAuthCheck(Migrate);
MediaWithAuth.layout = CustomLayout;
export default MediaWithAuth;

const today = function () {
  const d = new Date();
  return (
    (d.getDate() < 10 ? "0" : "") +
    d.getDate() +
    "/" +
    (d.getMonth() + 1 < 10 ? "0" : "") +
    (d.getMonth() + 1) +
    "/" +
    d.getFullYear()
  );
};

function download(blob: Blob) {
  const a = document.createElement("a");
  document.body.appendChild(a);
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = `lp-data-${today()}.json`;
  a.click();
  setTimeout(() => {
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }, 0);
}
