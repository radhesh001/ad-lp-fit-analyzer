const DIMENSION_LABELS = {
  persona: "Persona",
  offer: "Offer",
  productFraming: "Product Framing",
  proof: "Proof",
  objections: "Objections",
  aboveFoldContinuity: "Above-the-Fold Continuity",
};

const getScoreColor = (score) => {
  if (score >= 75) return "score-green";
  if (score >= 50) return "score-yellow";
  return "score-red";
};

const DimensionCard = ({ name, data }) => {
  return (
    <div className="dimension-card">
      <div className="dimension-header">
        <h3>{DIMENSION_LABELS[name]}</h3>
        <span className={`score-badge ${getScoreColor(data.score)}`}>
          {data.score}/100
        </span>
      </div>

      <div className="dimension-row">
        <div className="signal-block">
          <span className="label">Ad says</span>
          <p>{data.adSignal}</p>
        </div>
        <div className="signal-block">
          <span className="label">LP says</span>
          <p>{data.lpSignal}</p>
        </div>
      </div>

      {data.gap && data.gap !== "No gap" && (
        <div className="gap-block">
          <span className="label gap-label">⚠ Gap</span>
          <p>{data.gap}</p>
        </div>
      )}

      <div className="suggestion-block">
        <span className="label">💡 Suggestion</span>
        <p>{data.suggestion}</p>
      </div>
    </div>
  );
};

const MismatchReport = ({ report }) => {
  return (
    <div className="report-wrapper">
      <div className="overall-score">
        <span>Overall Fit Score</span>
        <strong className={getScoreColor(report.overallScore)}>
          {report.overallScore}/100
        </strong>
      </div>

      <div className="dimensions-grid">
        {Object.entries(report.dimensions).map(([key, value]) => (
          <DimensionCard key={key} name={key} data={value} />
        ))}
      </div>
    </div>
  );
};

export default MismatchReport;