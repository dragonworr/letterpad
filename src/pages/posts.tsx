import {
  PostsFilters,
  PostsDocument,
  PostsQuery,
  PostsQueryVariables,
  PostTypes,
} from "@/__generated__/queries/queries.graphql";
import { initializeApollo } from "@/graphql/apollo";
import { Button, Layout, PageHeader, Table } from "antd";
import Filters from "@/components/filters";
import { Breakpoint } from "antd/lib/_util/responsiveObserve";
import {
  Author,
  Image,
  PostsResponse,
  PostStatusOptions,
  Setting,
  Tags,
} from "@/__generated__/type-defs.graphqls";
const { Content } = Layout;
import CustomLayout from "@/components/layouts/Layout";
import { useRouter } from "next/router";
import withAuthCheck from "../hoc/withAuth";
import { useEffect, useState } from "react";
import ErrorMessage from "@/components/ErrorMessage";

interface IProps {
  data: PostsResponse;
  settings: Setting;
}

function Posts({ settings }: IProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<PostsFilters>({});

  const [postsNode, setPostsNode] = useState<PostsQuery["posts"]>({
    count: 0,
    rows: [],
  });

  const [error, setError] = useState("");

  useEffect(() => {
    fetchPosts(filters);
  }, [JSON.stringify(filters)]);

  const fetchPosts = async (filters = {}) => {
    const posts = await fetchPostsFromAPI(filters);
    setLoading(false);
    if (posts.__typename === "PostsNode") {
      const rows = posts.rows.map(post => {
        return {
          ...post,
          key: post.id,
        };
      });
      setPostsNode({ ...posts, rows });
    }

    if (posts.__typename === "PostError") {
      setError(posts.message);
    }
  };

  if (error) return <ErrorMessage description={error} title="Error" />;
  const source = postsNode.__typename === "PostsNode" ? postsNode.rows : [];

  return (
    <>
      <PageHeader
        className="site-page-header"
        title="Posts"
        extra={[
          <Button
            key="1"
            type="primary"
            onClick={() => router.push("/post/create")}
          >
            New Post
          </Button>,
        ]}
      ></PageHeader>
      <Content style={{ margin: "16px 0px 0" }}>
        <div
          className="site-layout-background"
          style={{ padding: 24, minHeight: "77vh" }}
        >
          <Filters
            onStatusChange={status => setFilters({ ...filters, status })}
            onOrderChange={sortBy => setFilters({ ...filters, sortBy })}
          />
          <Table
            columns={columns}
            dataSource={source}
            loading={loading}
            onRow={row => ({
              onClick: () => router.push("/post/" + row.id),
            })}
          />
          <style jsx>{`
            :global(.post-status) {
              width: 10px;
              height: 10px;
              display: block;
              border-radius: 50%;
              margin-left: 10px;
            }
            :global(.post-status-published) {
              background: green;
            }
            :global(.post-status-draft) {
              background: orange;
            }
          `}</style>
        </div>
      </Content>
    </>
  );
}

const PostsWithAuth = withAuthCheck(Posts);
PostsWithAuth.layout = CustomLayout;
export default PostsWithAuth;

async function fetchPostsFromAPI(filters: PostsFilters) {
  const apolloClient = await initializeApollo();

  const post = await apolloClient.query<PostsQuery, PostsQueryVariables>({
    query: PostsDocument,
    variables: {
      filters: {
        type: PostTypes.Post,
        ...filters,
      },
    },
    fetchPolicy: "network-only",
  });
  return post.data.posts;
}

const columns = [
  {
    title: "Image",
    dataIndex: "cover_image",
    key: "cover_image",
    responsive: ["md"] as Breakpoint[],
    render: (cover_image: Image) => <img src={cover_image.src} width={80} />,
  },
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "Description",
    dataIndex: "excerpt",
    key: "excerpt",
    responsive: ["md"] as Breakpoint[],
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status: PostStatusOptions) => (
      <span className={`post-status post-status-${status}`} />
    ),
  },
  {
    title: "Tags",
    dataIndex: "tags",
    key: "tags",
    render: (tags: Tags[]) => tags.map(tag => tag.name).join(", "),
  },
];
