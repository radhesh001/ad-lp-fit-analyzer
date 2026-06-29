import scrapeLandingPage from "../services/scraperService.js";
import analyzeFit from "../services/Geminiservice.js";

const analyze = async (req, res) => {
  const { ads, url } = req.body;

  if (!ads || !Array.isArray(ads) || ads.length === 0) {
    return res.status(400).json({ error: "At least one ad is required." });
  }

  if (!url) {
    return res.status(400).json({ error: "Landing page URL is required." });
  }

  try {
    const landingPage = await scrapeLandingPage(url);
    const report = await analyzeFit(ads, landingPage);
    res.json({ success: true, report });
  } catch (error) {
    console.error("Analysis error:", error.message);
    res.status(500).json({ error: error.message || "Analysis failed." });
  }
};

export default { analyze };
