const express = require("express");
const cors = require("cors");
const puppeteer = require("puppeteer");

var app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  app.use(cors());
  next();
});

app.get("/", async (req, res) => {
  const x = await scrapeWord(req.query.search);
  res.send({ number: x });
});

async function scrapeWord(word) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://g1.globo.com/");

  const [el] = await page.$x("/html/body/div[2]");
  const txt = await el.getProperty("textContent");
  const rawTxt = txt.toString();

  browser.close();

  const regexp = new RegExp(`\\b${word}\\b`, "gi");

  return rawTxt.search(regexp);
}

app.listen(8000);
