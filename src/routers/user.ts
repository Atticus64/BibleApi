import { Hono } from "hono/mod.ts";
import { deleteDB, checkDB, getUserInfo } from "$/controllers/user.ts";

const router_user = new Hono();

router_user.get("/", getUserInfo)

router_user.post("/delete", deleteDB)

router_user.post("/check", checkDB)

export default router_user
