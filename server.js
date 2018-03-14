/* eslint capitalized-comments: ["error", "never"] */

const Koa = require('koa');
const Router = require('koa-router');
const json = require('koa-json');

const app = new Koa();
const router = new Router();

router.get('/', async ctx => {
	ctx.body = {message: 'Hello, World!'};
});

app
	.use(json())
	.use(router.routes())
	.use(router.allowedMethods());

app.listen(3000);
