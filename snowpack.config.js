module.exports = {
  plugins: ["@snowpack/plugin-sass", "@snowpack/plugin-typescript"],
  mount: {
    public: { url: "/", static: true },
    src: "/",
  },
};
