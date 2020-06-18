export default {
  Query: {
    google: (parent, args, context, info) => {
      context.res.redirect("https://google.com");
      return "Google!";
    }
  }
};
