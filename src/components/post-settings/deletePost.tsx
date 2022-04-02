import { usePostFromCache } from "@/hooks/usePostFromCache";
import { useUpdatePost } from "@/hooks/useUpdatePost";
import { PostStatusOptions, PostTypes } from "@/__generated__/__types__";
import { Button } from "antd";
import { useRouter } from "next/router";

interface Props {
  postId: number;
}
export const DeletePost: React.VFC<Props> = ({ postId }) => {
  const router = useRouter();
  const post = usePostFromCache(postId);
  const { updatePost } = useUpdatePost();
  const isPost = post?.type === PostTypes.Post;
  const postVerb = isPost ? "Post" : "Page";

  const deletePost = () => {
    updatePost({ id: postId, status: PostStatusOptions.Trashed });
    router.push(isPost ? "/posts" : "/pages");
  };
  return (
    <Button type="primary" danger onClick={deletePost}>
      Delete {postVerb}
    </Button>
  );
};