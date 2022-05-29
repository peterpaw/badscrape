import express, { Request, Response } from "express"
import mysql from "mysql"
import dotenv from "dotenv"

import { RowProps } from "./seed"

dotenv.config()

const app = express()

const connectionString = process.env.DATABASE_URL || ""
const connection = mysql.createConnection(connectionString)
connection.connect()

// Find position of current team
function getPosition(rows: RowProps[]): number {
  const positionInArray = rows.findIndex((r: any) =>
    r.team_name.match(/Rot-Weiss Walldorf/)
  )

  if (positionInArray !== -1) {
    return positionInArray + 1
  } else return positionInArray
}

app.get("/api/rww1", (req: Request, res: Response) => {
  const query = "SELECT * FROM team_one"
  connection.query(query, (err, rows) => {
    if (err) throw err

    const retVal = {
      data: rows,
      placing: getPosition(rows),
      message: rows.length === 0 ? "No records found" : null
    }

    return res.send(retVal)
  })
})

app.get("/api/rww2", (req: Request, res: Response) => {
  const query = "SELECT * FROM team_two"
  connection.query(query, (err, rows) => {
    if (err) throw err

    const retVal = {
      data: rows,
      placing: getPosition(rows),
      message: rows.length === 0 ? "No records found" : null
    }

    return res.send(retVal)
  })
})

app.get("/api/rww3", (req: Request, res: Response) => {
  const query = "SELECT * FROM team_three"
  connection.query(query, (err, rows) => {
    if (err) throw err

    const retVal = {
      data: rows,
      placing: getPosition(rows),
      message: rows.length === 0 ? "No records found" : null
    }

    return res.send(retVal)
  })
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log("app is running")
})
