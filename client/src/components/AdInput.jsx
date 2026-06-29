const AdInput = ({ ads, setAds }) => {
  const handleChange = (index, value) => {
    const updated = [...ads];
    updated[index] = value;
    setAds(updated);
  };

  const addAd = () => {
    setAds([...ads, ""]);
  };

  const removeAd = (index) => {
    if (ads.length === 1) return; // keep at least one
    setAds(ads.filter((_, i) => i !== index));
  };

  return (
    <div className="section">
      <h2>Ad Copy</h2>
      <p className="subtitle">Paste one or more ads to analyze</p>

      {ads.map((ad, index) => (
        <div key={index} className="ad-row">
          <textarea
            className="textarea"
            rows={4}
            placeholder={`Ad ${index + 1}: Paste your ad copy here...`}
            value={ad}
            onChange={(e) => handleChange(index, e.target.value)}
          />
          {ads.length > 1 && (
            <button
              className="btn-remove"
              onClick={() => removeAd(index)}
              title="Remove this ad"
            >
              ✕
            </button>
          )}
        </div>
      ))}

      <button className="btn-secondary" onClick={addAd}>
        + Add Another Ad
      </button>
    </div>
  );
};

export default AdInput;