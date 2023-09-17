import { Context } from "hono/mod.ts";
import { getToken } from "$/middlewares/authorization.ts";
import { getUser } from "$/middlewares/user.ts";
import { z } from "zod";

export const getUserInfo = async (c: Context) => {
  const token = getToken(c);
  const user = await getUser(token);

  if (!user) {
    c.status(400);
    return;
  }

  return c.json(user);
};

export const deleteUser = async (c: Context) => {
  const kv = await Deno.openKv();

  const data = await c.req.json();

  const schema = z.object({
    email: z.string().email(),
    ADMIN_PASS: z.string().min(8),
  });

  const info = schema.parse(data);

  try {
    const d = await kv.get(["users_by_email", info.email]);
    if (info.ADMIN_PASS !== Deno.env.get("ADMIN_PASS")) {
      c.status(401);
      c.json({
        message: "Unauthorized",
      });
      return;
    }

    const usr = d.value as { user: string };
    await kv.delete(["users_by_email", info.email]);
    await kv.delete(["users", usr.user as string]);

    c.status(200);
    return c.json({
      deleted: true,
    });
  } catch (e) {
    console.log({ Error: e });
    c.status(500);
  }
};

export const deleteDB = async (c: Context): Promise<Response> => {
  const kv = await Deno.openKv();

  for await (const { key } of kv.list({ prefix: ["users"] })) {
    await kv.delete(key);
  }

  for await (const { key } of kv.list({ prefix: ["users_by_email"] })) {
    await kv.delete(key);
  }

  for await (const { key } of kv.list({ prefix: ["notes"] })) {
    await kv.delete(key);
  }

  return c.json({ message: "OK" });
};

export const checkDB = async (c: Context): Promise<Response> => {
  const kv = await Deno.openKv();

  for await (const item of kv.list({ prefix: ["users"] })) {
    console.log(item);
  }

  for await (const item of kv.list({ prefix: ["users_by_email"] })) {
    console.log(item);
  }

  for await (const item of kv.list({ prefix: ["notes"] })) {
    console.log(item);
  }

  return c.json({ message: "OK" });
};
