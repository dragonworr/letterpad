import { getSession } from "next-auth/react";

import { prisma } from "@/lib/prisma";

import getAuthorIdFromRequest from "@/shared/getAuthorIdFromRequest";

import { SessionData } from "./types";

const isTest = process.env.NODE_ENV === "test";

export const getResolverContext = async (context) => {
  const session = isTest
    ? null
    : ((await getSession(context)) as unknown as { user: SessionData });
  let client_author_id: number | null = null;

  if (!session?.user.id) {
    const authorIdFound = await getAuthorIdFromRequest(context);
    if (authorIdFound) {
      client_author_id = authorIdFound;
    }
  } else {
    client_author_id = session.user.id;
  }

  if (client_author_id) {
    return {
      session,
      client_author_id,
      prisma,
    };
  }

  return {
    session,
    prisma,
  };
};

type Awaited<T> = T extends null | undefined
  ? T // special case for `null | undefined` when not in `--strictNullChecks` mode
  : T extends object & { then(onfulfilled: infer F): any } // `await` only unwraps object types with a callable `then`. Non-object types are not unwrapped
  ? F extends (value: infer V, ...args: any) => any // if the argument to `then` is callable, extracts the first argument
    ? Awaited<V> // recursively unwrap the value
    : never // the argument to `then` was not callable
  : T; // non-object or non-thenable

export type ResolverContext = Awaited<ReturnType<typeof getResolverContext>>;
