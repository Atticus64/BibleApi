import { Context } from "hono";
import { getUser } from "$/middlewares/user.ts";
import { getToken } from "$/middlewares/authorization.ts";

const getNotes = async (c: Context): Promise<Response> => {
	const kv = await Deno.openKv();
	const token = getToken(c);
	const user = await getUser(token);

	if (!user) {
		c.status(401);
		return c.json({
			message: "User not found",
		});
	}

	const data = await kv.get(["notes", user.id]);

	if (!data.value) {
		kv.set(["notes", user.id], []);
		return c.json([]);
	} else {
		return c.json(data.value);
	}
};

const getNoteById = async (c: Context): Promise<Response> => {
	const kv = await Deno.openKv();

	const token = getToken(c);
	const user = await getUser(token);

	if (!user) {
		c.status(401);
		return c.json({
			message: "User not found",
		});
	}

	const id = c.req.param("id");

	const { value } = await kv.get(["notes", user.id]) as { value?: Array<Note> };
	if (!value) {
		kv.set(["notes", user.id], []);
		return c.json([]);
	}

	const note = value.find((n: Note) => n.id === id);

	if (!note) {
		c.status(404);
		return c.json({
			message: "Note not found",
		});
	}

	return c.json(note);
};

interface NoteDto {
	title: string;
	description: string;
	body: string;
	page?: string;
}

interface Note extends NoteDto {
	id: string;
}

const createNote = async (c: Context, note: NoteDto) => {
	const { title, description, body, page } = note;

	const kv = await Deno.openKv();

	const token = getToken(c);
	const user = await getUser(token);

	if (!user) {
		c.status(400);
		return c.json({
			message: "User not found",
		});
	}

	const d = await kv.get(["notes", user.id]);

	const uniqueId = crypto.randomUUID();
	if (!d.value) {
		const data = [];
		data.push({ title, description, body, id: uniqueId, page });
		await kv.set(["notes", user.id], data);
	} else {
		const data = d.value as Array<Note>;
		data.push({ title, description, body, id: uniqueId, page });
		await kv.set(["notes", user.id], data);
	}

	c.status(201);

	return c.json({
		created: true,
		id: uniqueId,
	});
};

const editNote = async (c: Context, note: NoteDto): Promise<Response> => {
	const { title, description, body } = note;
	const kv = await Deno.openKv();

	const token = getToken(c);
	const user = await getUser(token);

	if (!user) {
		c.status(400);
		return c.json({
			message: "User not found",
		});
	}

	const d = await kv.get(["notes", user.id]);

	if (!d.value) {
		return c.json({
			message: "Notes not found",
		});
	}

	const data = d.value as Array<Note>;
	const id = c.req.param("id");

	data.forEach((n) => {
		if (n.id === id) {
			n.title = title;
			n.description = description;
			n.body = body;
		}
	});

	await kv.set(["notes", user.id], data);
	c.status(200);
	return c.json({
		edited: true,
	});
};

const deleteNote = async (c: Context): Promise<Response> => {
	const kv = await Deno.openKv();

	const token = getToken(c);
	const user = await getUser(token);

	if (!user) {
		c.status(400);
		return c.json({
			message: "User not found",
		});
	}

	const d = await kv.get(["notes", user.id]);

	if (!d.value) {
		return c.json({
			message: "Note not found",
		});
	}

	let data = d.value as Array<Note>;
	const id = c.req.param("id");
	data = data.filter((n) => n.id !== id);

	await kv.set(["notes", user.id], data);

	c.status(200);
	return c.json({
		deleted: true,
	});
};

export { createNote, deleteNote, editNote, getNoteById, getNotes };
