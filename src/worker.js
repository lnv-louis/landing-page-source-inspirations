export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (/^\/pages\/[^/]+$/.test(url.pathname)) {
      url.pathname = `${url.pathname}/`;
      return Response.redirect(url.toString(), 301);
    }

    return env.ASSETS.fetch(request);
  },
};
