import axios from "axios";
import * as cheerio from "cheerio";

const scrapeLandingPage = async (url) => {
  const { data } = await axios.get(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
    },
    timeout: 10000,
  });

  const $ = cheerio.load(data);

  // Remove noise elements
  $("script, style, noscript, footer, nav").remove();

  // Extract key sections
  const title = $("title").text().trim();
  const metaDesc = $('meta[name="description"]').attr("content") || "";
  const h1 = $("h1").first().text().trim();
  const h2s = $("h2")
    .map((_, el) => $(el).text().trim())
    .get()
    .join(" | ");
  const bodyText = $("body").text().replace(/\s+/g, " ").trim().slice(0, 3000);

  return {
    title,
    metaDesc,
    h1,
    h2s,
    bodyText,
  };
};

export default scrapeLandingPage;