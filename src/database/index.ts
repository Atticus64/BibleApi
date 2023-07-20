import { Client } from 'postgres'
import "https://deno.land/x/dotenv@v3.2.2/load.ts";


export function connect() {
	return new Client(Deno.env.get("DATABASE_URL"));
}