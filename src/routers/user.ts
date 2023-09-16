import { Hono } from "hono/mod.ts";
import { getUserInfo } from "$/controllers/user.ts";

const router_user = new Hono();

router_user.get("/", getUserInfo)


export default router_user
