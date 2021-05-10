import jwt from "jsonwebtoken";
import dbModels from "./../models/index";
import bcrypt from "bcryptjs";
import copydir from "copy-dir";
import generatePost from "./contentGenerator";
import mkdirp from "mkdirp";
import path from "path";
import posts from "./posts";
import { promisify } from "util";
import rimraf from "rimraf";
import { settingsData } from "../models/setting";

const mkdirpAsync = promisify(mkdirp);
const rimrafAsync = promisify(rimraf);
const copydirAsync = promisify(copydir);

// All paths are relative to this file
const dataDir = "../../../../data";
const publicUploadsDir = "../../../../public/uploads";
const uploadsSourceDir = "./uploads";

function absPath(p) {
  return path.join(__dirname, p);
}

let models: typeof dbModels;
export const seed = async (_models: typeof dbModels, autoExit = true) => {
  models = _models;

  console.time("ensure data directories");
  await Promise.all([
    mkdirpAsync(absPath(dataDir)),
    mkdirpAsync(absPath(publicUploadsDir)),
  ]);
  console.timeEnd("ensure data directories");

  console.time("sync sequelize models");
  await models.sequelize.sync({ force: true });
  console.timeEnd("sync sequelize models");

  // do some clean first. delete the uploads folder
  console.time("sync uploads");
  await rimrafAsync(path.join(absPath(publicUploadsDir, "*")));
  await copydirAsync(absPath(uploadsSourceDir), absPath(publicUploadsDir));
  console.timeEnd("sync uploads");

  console.time("insert roles and permissions");
  await insertRolePermData(models);
  console.timeEnd("insert roles and permissions");

  console.time("insert authors and Tags");
  await Promise.all([insertAuthor(models), insertTags(models)]);
  console.timeEnd("insert authors and Tags");

  console.time("Asssign Role to author");
  const role = await models.Role.findOne({ where: { id: 1 } });
  const authors = await models.Author.findAll();
  if (role && authors) {
    await Promise.all([
      ...authors.map(async author => {
        await author.setRole(role);
      }),
    ]);
  }
  console.timeEnd("Asssign Role to author");

  console.time("insert posts, settings, media");
  const [tags] = await Promise.all([models.Tags.findAll()]);

  await Promise.all([...posts.map(post => insertPost(post, models, tags))]);
  await insertSettings();
  await insertMedia();
  console.timeEnd("insert posts, settings, media");

  console.time("Asssign Setting to author");
  const setting = await models.Setting.findOne({
    where: { id: 1 },
  });
  if (setting && authors) {
    await Promise.all([
      ...authors.map(async author => {
        const token = jwt.sign(
          {
            id: 1,
          },
          process.env.SECRET_KEY,
          {
            algorithm: "HS256",
          },
        );
        return Promise.all([
          setting.update({ client_token: token }),
          author.setSetting(setting),
        ]);
      }),
    ]);
  }
  console.timeEnd("Asssign Setting to author");
};

export async function insertRolePermData(models) {
  const [
    MANAGE_OWN_POSTS,
    READ_ONLY_POSTS,
    MANAGE_ALL_POSTS,
    MANAGE_USERS,
    MANAGE_SETTINGS,
  ] = await Promise.all([
    models.Permission.create({
      name: "MANAGE_OWN_POSTS",
    }),
    models.Permission.create({
      name: "READ_ONLY_POSTS",
    }),
    models.Permission.create({
      name: "MANAGE_ALL_POSTS",
    }),
    models.Permission.create({
      name: "MANAGE_USERS",
    }),
    models.Permission.create({
      name: "MANAGE_SETTINGS",
    }),
  ]);

  async function admin() {
    const role = await models.Role.create({ name: "ADMIN" });
    return Promise.all([
      role.addPermission(READ_ONLY_POSTS),
      role.addPermission(MANAGE_ALL_POSTS),
      role.addPermission(MANAGE_USERS),
      role.addPermission(MANAGE_SETTINGS),
      role.addPermission(MANAGE_OWN_POSTS),
    ]);
  }

  async function reviewer() {
    const role = await models.Role.create({ name: "REVIEWER" });
    return role.addPermission(MANAGE_ALL_POSTS);
  }

  async function reader() {
    const role = await models.Role.create({ name: "READER" });
    return role.addPermission(READ_ONLY_POSTS);
  }

  async function author() {
    const role = await models.Role.create({ name: "AUTHOR" });
    return role.addPermission(MANAGE_OWN_POSTS);
  }

  return Promise.all([admin(), reviewer(), reader(), author()]);
}

export async function insertAuthor(models) {
  return await models.Author.bulkCreate([
    {
      name: "John",
      email: "demo@demo.com",
      password: bcrypt.hashSync("demo", 12),
      social: JSON.stringify({
        twitter: "https://twitter.com",
        facebook: "https://facebook.com",
        github: "https://github.com",
        instagram: "https://instagram.com",
      }),
      username: "demo",
      bio:
        "Provident quis sed perferendis sed. Sed quo nam eum. Est quos beatae magnam ipsa ut cupiditate nostrum officiis. Vel hic sit voluptatem. Minus minima quis omnis.",
      avatar:
        "https://images.unsplash.com/photo-1572478465144-f5f6573e8bfd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=120&q=80",
    },
    {
      name: "Jim Parker",
      email: "author@letterpad.app",
      username: "author",
      password: bcrypt.hashSync("demo", 12),
      social: JSON.stringify({
        twitter: "https://twitter.com",
        facebook: "https://facebook.com",
        github: "https://github.com",
        instagram: "https://instagram.com",
      }),
      bio:
        "Provident quis sed perferendis sed. Sed quo nam eum. Est quos beatae magnam ipsa ut cupiditate nostrum officiis. Vel hic sit voluptatem. Minus minima quis omnis.",
      avatar:
        "https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=120&q=80",
    },
  ]);
}

export async function insertTags(models: typeof dbModels) {
  const author = await models.Author.findOne({ where: { id: 1 } });
  const tags = [
    {
      name: "Home",
      slug: "home",
      desc: "",
    },
    {
      name: "first-post",
      slug: "first-post",
      desc: "",
    },
  ];

  if (author) {
    return Promise.all([...tags.map(tag => author.createTag(tag))]);
  }
}

export async function insertPost(params, models: typeof dbModels, tags) {
  // get author  // 1 or 2
  const { md, html } = generatePost(params.type);
  let promises: any[] = [];
  const randomAuthorId = 1; //Math.floor(Math.random() * (2 - 1 + 1)) + 1;
  let admin = await models.Author.findOne({ where: { id: randomAuthorId } });
  const title =
    params.type === "post" ? "Welcome to Letterpad" : "Letterpad Typography";
  const slug = title.toLocaleLowerCase().replace(/ /g, "-");

  let post = await models.Post.create({
    title,
    md: md,
    html: html,
    excerpt:
      "You can use this space to write a small description about the topic. This will be helpful in SEO.",
    cover_image: params.cover_image,
    authorId: randomAuthorId,
    type: params.type,
    status: params.status,
    slug: slug,
    createdAt: new Date(),
    publishedAt: new Date(),
    reading_time: "5 mins",
  });
  if (admin && post) {
    promises = [admin.addPost(post)];
    if (params.type === "post") {
      promises = [...promises, ...tags.map(tag => post.addTag(tag))];
    }

    return Promise.all(promises);
  }
}

export async function insertMedia() {
  const author = await models.Author.findOne({ where: { id: 1 } });
  if (author) {
    await author.createMedia({
      url:
        "https://images.unsplash.com/photo-1473181488821-2d23949a045a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
      name: "Blueberries",
      width: 1350,
      height: 900,
      description:
        "Write a description about this image. You never know how this image can break the internet",
    });

    await author.createMedia({
      url:
        "https://images.unsplash.com/photo-1524654458049-e36be0721fa2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
      width: 1350,
      height: 900,
      name: "I love the beach and its smell",
      description:
        "Write a description about this image. You never know how this image can break the internet",
    });
  }
}

export async function insertSettings() {
  const authors = await models.Author.findAll();

  return Promise.all([
    ...authors.map(author => author.createSetting(settingsData)),
  ]);
}
