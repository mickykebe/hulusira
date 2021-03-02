import Router from "next/router";

export default function Redirect(ctx, target) {
  if (ctx.res) {
    ctx.res.writeHead(303, { Location: target });
    ctx.res.end();
  } else {
    Router.replace(target);
  }
}
