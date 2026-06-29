const UrlInput = ({ url, setUrl }) => {
  return (
    <div className="section">
      <h2>Landing Page URL</h2>
      <p className="subtitle">Enter the URL of the landing page to analyze</p>
      <input
        type="url"
        className="input"
        placeholder="https://example.com/landing-page"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
    </div>
  );
};

export default UrlInput;