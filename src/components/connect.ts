import sql from "mysql";
import { mysqlData } from "../services/mysql";


export const connector = sql.createConnection(mysqlData);
