const menu = [
  {
    label: "home",
    original_name: "home",
    slug: "home",
    type: "tag",
  },
];

/**
 * Keep this file in commonjs format. It is being used in migrations which are in commonjs.
 */

module.exports.subjects = {
  VerifyNewUser: "{{ company_name }} - Verify Email",
  VERIFY_EMAIL_CHANGE: "{{ company_name }} - Email Change Verification",
  ForgotPassword: "{{ company_name }} - Reset your password",
  VerifySubscriber: "{{ blog_name }} - Verify your email",
  NewPost: "{{ blog_name }} - New Post",
};

module.exports.defaultSettings = {
  site_title: "Letterpad",
  site_tagline: "",
  site_email: "admin@letterpad.app",
  site_url: "",
  site_footer: "Powered by Letterpad",
  site_description: "",
  subscribe_embed: "",
  display_author_info: true,
  site_logo: JSON.stringify({
    src: "https://letterpad.app/admin/uploads/logo.png",
    width: 200,
    height: 200,
  }),
  site_favicon: JSON.stringify({
    src: "https://letterpad.app/admin/uploads/logo.png",
    width: 200,
    height: 200,
  }),
  css: "",
  theme: "minimal",
  menu: JSON.stringify(menu),
  design: JSON.stringify({ brand_color: "#d93097" }),
  cloudinary_key: "",
  cloudinary_name: "",
  cloudinary_secret: "",
  client_token: "",
  banner: JSON.stringify({}),
  intro_dismissed: false,
  show_about_page: false,
  show_tags_page: false,
};
