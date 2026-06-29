const AdClusters = ({ clusters, ads }) => {
  if (!clusters || clusters.length === 0) return null;

  return (
    <div className="clusters-wrapper">
      <h2>Ad Angle Clusters</h2>
      <p className="subtitle">
        Gemini grouped your ads by angle and suggested tailored LP sections
      </p>

      {clusters.map((cluster, i) => (
        <div key={i} className="cluster-card">
          <div className="cluster-header">
            <h3>{cluster.clusterName}</h3>
            <span className="cluster-badge">
              {cluster.adIndexes.length} ad{cluster.adIndexes.length > 1 ? "s" : ""}
            </span>
          </div>

          <div className="cluster-ads">
            <span className="label">Ads in this cluster</span>
            {cluster.adIndexes.map((idx) => (
              <blockquote key={idx} className="ad-quote">
                {ads[idx]?.slice(0, 120)}
                {ads[idx]?.length > 120 ? "..." : ""}
              </blockquote>
            ))}
          </div>

          <div className="cluster-sections">
            <span className="label">Suggested LP sections</span>
            <ul>
              {cluster.suggestedLPSections.map((section, j) => (
                <li key={j}>{section}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdClusters;