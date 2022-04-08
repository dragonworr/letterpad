import { NextApiRequest } from "next";
import { Author as GraphqlAuthor } from "@/__generated__/__types__";
import { Post, Author, Setting } from "@prisma/client";

export enum ROLES {
  ADMIN = "ADMIN",
  REVIEWER = "REVIEWER",
  READER = "READER",
  AUTHOR = "AUTHOR",
}

export enum PERMISSIOMS {
  MANAGE_ALL_POSTS = "MANAGE_ALL_POSTS",
  MANAGE_OWN_POSTS = "MANAGE_OWN_POSTS",
  READ_ONLY_POSTS = "READ_ONLY_POSTS",
}

export enum PostTypes {
  post,
  page,
}

export type updatePostOptionalArgs = {
  cover_image: string;
  cover_image_width: number;
  cover_image_height: number;
} & Omit<Post, "cover_image" | "cover_image_width" | "cover_image_height">;

export type Session = Pick<
  GraphqlAuthor,
  "id" | "email" | "role" | "permissions" | "avatar" | "username" | "name"
>;

export interface SessionData extends Session {
  expires: any;
  __typename: "SessionData";
}

export interface IMediaUploadResult {
  src: string;
  error: string | null;
  name: string;
  size: {
    width: number;
    height: number;
    type: string;
  };
}

export type NextApiRequestWithFormData = NextApiRequest & {
  files: BlobCorrected[];
};

export type BlobCorrected = Blob & {
  buffer: Buffer;
  originalname: string;
  hash: string;
};

interface IImageAttrs {
  src: string;
  sizes: string;
  "data-srcset": string;
  srcSet: string;
  width: string;
  loading: "lazy";
}
export type IImageAttrsResult = IImageAttrs | {};

interface IProcessEnv {
  DB_USER?: string;
  DB_URL: string;
  DB_NAME?: string;
  DB_PASSWORD?: string;
  DB_TYPE?: string;
}

declare namespace NodeJS {
  export interface ProcessEnv extends IProcessEnv {}
}

export enum EmailTemplates {
  VerifyNewUser = "verifyNewUser",
  VerifyChangedEmail = "verifyChangedEmail",
  VerifySubscriber = "verifySubscriber",
  ForgotPassword = "forgotPassword",
  NewPost = "newPost",
  WelcomeUser = "welcomeUser",
}
export interface Template {
  body: string;
  subject: string;
}

export interface EmailVerifyNewUserProps {
  author_id: number;
  template_id: EmailTemplates.VerifyNewUser;
}

export interface EmailVerifyNewEmailProps {
  author_id: number;
  template_id: EmailTemplates.VerifyChangedEmail;
}

export interface EmailVerifySubscriberProps {
  author_id: number;
  subscriber_email: string;
  template_id: EmailTemplates.VerifySubscriber;
}

export interface EmailNewPostProps {
  post_id: number;
  template_id: EmailTemplates.NewPost;
}

export interface EmailForgotPasswordProps {
  author_id: number;
  template_id: EmailTemplates.ForgotPassword;
}

export interface EmailWelcomeUserProps {
  author_id: number;
  template_id: EmailTemplates.WelcomeUser;
}

export type EmailProps =
  | EmailVerifyNewUserProps
  | EmailVerifyNewEmailProps
  | EmailVerifySubscriberProps
  | EmailNewPostProps
  | EmailWelcomeUserProps
  | EmailForgotPasswordProps;

export interface Mail {
  to: string | string[];
  subject: string;
  html: string;
}

export interface EmailTemplateMeta {
  author: Author & { setting: Setting | null };
}

export interface EmailTemplateSuccess {
  ok: true;
  content: Mail;
  meta: EmailTemplateMeta;
}
interface EmailTemplateError {
  ok: false;
  message: string;
}

export type EmailTemplateResponse = EmailTemplateSuccess | EmailTemplateError;

export type ValueOf<T> = T[keyof T];
