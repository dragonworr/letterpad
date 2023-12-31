import { ResolversTypes } from "@/__generated__/__types__";
import { ResolverContext } from "@/graphql/context";

export const getAuthorFromPost = async (
  id: number,
  { prisma }: ResolverContext
): Promise<ResolversTypes["AuthorResponse"]> => {
  const post = await prisma.post.findFirst({
    where: { id },
    include: { author: true },
  });

  if (post?.author) {
    return {
      __typename: "Author",
      ...post.author,
      register_step: post.author
        .register_step as ResolversTypes["RegisterStep"],
      analytics_id: post.author.analytics_id || undefined,
      analytics_uuid: post.author.analytics_uuid || undefined,
      stripe_customer_id: post.author.stripe_customer_id || undefined,
      stripe_subscription_id: post.author.stripe_subscription_id || undefined,
      social: JSON.parse(post.author.social),
    };
  }
  return {
    __typename: "NotFound",
    message: `Author of post ${id} was not found`,
  };
};
