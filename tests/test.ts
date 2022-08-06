import { Zeri } from '../src';
import { config } from "dotenv";

config({ path: __dirname + './.env'})
const key = process.env.RIOT_API_KEY!;

const zeri = new Zeri(key);