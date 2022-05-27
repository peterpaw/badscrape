import express, { Request, Response } from "express"
import mysql from "mysql"
import dotenv from "dotenv"

dotenv.config()

const app = express()

const connectionString = process.env.DATABASE_URL || ""
const connection = mysql.createConnection(connectionString)
connection.connect()

app.get("/api/table", (req: Request, res: Response) => {
  const query = "SELECT * FROM ladder"
  connection.query(query, (err, rows) => {
    if (err) throw err

    const retVal = {
      data: rows,
      message: rows.length === 0 ? "No records found" : null
    }

    return res.send(retVal)
  })
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log("app is running")
})
