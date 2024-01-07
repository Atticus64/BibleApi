import { Context } from "hono/mod.ts";
import { z } from "zod";
import { Version } from "$/constants.ts";

const searchSchema = z.object({
	q: z.string().min(1),
	testament: z.enum(["old", "new", "both"]),
	take: z.number().min(1),
	page: z.number().min(1),
});

export interface searchProps {
	version: Version;
	query: string;
	take?: number;
	page?: number;
	testament?: "both" | "old" | "new";
}

export type Query = z.infer<typeof searchSchema>;

export const validQueries = (value: any, c: Context) => {
	const { q, take, page, testament } = value;

	if (!q) {
		c.status(400);
		return c.json({
			error: "query is required",
			path: ["q"],
		});
	}

	const options = ["old", "new", "both"];

	let test: "both" | "old" | "new" = "both";
	if (testament && !options.includes(testament)) {
		c.status(400);
		return c.json({
			error: "testament must be old, new or both",
			path: ["testament"],
		});
	} else {
		test = testament || test;
	}

	value.testament = test;
	value.take = take ? Number(take) : 10;
	value.page = page ? Number(page) : 1;

	const result = searchSchema.safeParse(value);

	if (!result.success) {
		c.status(400);
		return c.json({
			errors: result.error.issues,
		});
	}

	return value;
};
