import { Hono } from "hono";
import { getUserInfo } from "$/controllers/auth/user.ts";

const router_user = new Hono();

router_user.get("/", getUserInfo);

export default router_user;
