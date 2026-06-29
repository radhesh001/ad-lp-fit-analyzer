const AnalyzeButton = ({ onClick, loading }) => {
  return (
    <button
      className="btn-primary"
      onClick={onClick}
      disabled={loading}
    >
      {loading ? "Analyzing..." : "Analyze Fit →"}
    </button>
  );
};

export default AnalyzeButton;