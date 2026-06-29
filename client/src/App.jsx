import { useState } from "react";
import axios from "axios";
import AdInput from "./components/AdInput";
import UrlInput from "./components/UrlInput";
import AnalyzeButton from "./components/AnalyzeButton";
import MismatchReport from "./components/MismatchReport";
import AdClusters from "./components/AdClusters";
import Loader from "./components/Loader";

const API_URL = import.meta.env.VITE_API_URL || "https://ad-lp-fit-analyzer.onrender.com";

const App = () => {
  const [ads, setAds] = useState([""]);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    const filledAds = ads.filter((ad) => ad.trim() !== "");

    if (filledAds.length === 0) {
      setError("Please enter at least one ad.");
      return;
    }
    if (!url.trim()) {
      setError("Please enter a landing page URL.");
      return;
    }

    setError("");
    setLoading(true);
    setReport(null);

    try {
      const { data } = await axios.post(`${API_URL}/api/analyze`, {
        ads: filledAds,
        url: url.trim(),
      });
      setReport(data.report);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Ad → Landing Page Fit Analyzer</h1>
        <p>Find mismatches between your ad promise and landing page experience</p>
      </header>

      <main className="main">
        <AdInput ads={ads} setAds={setAds} />
        <UrlInput url={url} setUrl={setUrl} />

        {error && <p className="error">{error}</p>}

        <AnalyzeButton onClick={handleAnalyze} loading={loading} />

        {loading && <Loader />}

        {report && (
          <>
            <MismatchReport report={report} />
            <AdClusters clusters={report.adClusters} ads={ads} />
          </>
        )}
      </main>
    </div>
  );
};

export default App;
