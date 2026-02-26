const express = require("express")
const axios = require("axios")
const cors = require("cors")
const xml2js = require("xml2js")
const path = require("path")

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))

app.get("/search", async (req, res) => {
    const query = req.query.q
    try {
        const response = await axios.get(http://export.arxiv.org/api/query?search_query=all:${query}&start=0&max_results=10)
        const parser = new xml2js.Parser()
        const result = await parser.parseStringPromise(response.data)
        const entries = result.feed.entry || []
        const papers = entries.map(entry => ({
            title: entry.title[0],
            summary: entry.summary[0],
            link: entry.id[0],
            authors: entry.author.map(a => a.name[0]).join(", "),
            published: entry.published[0]
        }))
        res.json(papers)
    } catch (error) {
        res.status(500).json({ error: "Error fetching papers" })
    }
})

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000")
})