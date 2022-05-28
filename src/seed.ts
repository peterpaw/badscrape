import axios from "axios"
import cheerio from "cheerio"
import mysql from "mysql"
import dotenv from "dotenv"

dotenv.config()

const connectionString = process.env.DATABASE_URL || ""
const connection = mysql.createConnection(connectionString)
connection.connect()

interface RowProps {
  position: number
  teamName: string
  games: string
  points: string
}

const getTeamPage = async (teamNumber: string, url: string) => {
  const { data } = await axios.get(url)

  const $ = cheerio.load(data)
  const table = $("table.result-set")
  const tRows = $(table[0]).find("tr")

  let leagueData: RowProps[] = []

  let eachIndex = 0

  $(tRows).each(function () {
    if ($(this).find("a[alt='Mannschaftsportrait']").text().length !== 0) {
      const current = $(this).find("a[alt='Mannschaftsportrait']")
      const scoreElement = $(current).parent().siblings().splice(6, 1)
      const gamesPlayed = $(current).parent().siblings().splice(2, 1)
      // console.log(gamesPlayed.map((e) => $(e).text()))
      eachIndex += 1
      const internalIndex = 0
      leagueData.push({
        position: eachIndex,
        teamName: $(this).find("a").text(),
        games: $(gamesPlayed[internalIndex]).text().trim(),
        points: $(scoreElement[internalIndex]).text().trim()
      })
    }
  })

  console.log(leagueData)

  const values = leagueData.map((team) => [
    team.position,
    team.position,
    team.teamName,
    team.games,
    team.points
  ])
  const sql = `INSERT INTO team_${teamNumber} (id, position, team_name, games, points) VALUES ?`
  connection.query(sql, [values], (err) => {
    if (err) {
      console.error("An error occured while populating database")
      console.error(err)
    } else {
      console.log("Database population successful!")
    }
  })

  // let teamIndex = -1

  // leagueData.forEach((team, index) => {
  //   const teamCheck = new RegExp(/Rot-Weiss Walldorf/)
  //   if (teamCheck.test(team.teamName)) {
  //     teamIndex = index
  //   }
  // })

  // console.log(
  //   teamIndex !== -1
  //     ? `${leagueData[teamIndex].teamName} befindet sich an Position ${
  //         teamIndex + 1
  //       }`
  //     : "nicht in der Tabelle"
  // )
}

const team1 = getTeamPage("one", process.env.TEAM_1_URL || "")
const team2 = getTeamPage("two", process.env.TEAM_2_URL || "")
const team3 = getTeamPage("three", process.env.TEAM_3_URL || "")
