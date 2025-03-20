import React from 'react';

const DataStatus = ({ isLoading, error, isStale, lastUpdated, onRefresh }) => {
  const formatLastUpdated = () => {
    if (!lastUpdated) return '';
    
    return new Date(lastUpdated).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="data-status">
      {isLoading && (
        <div className="status-indicator loading">
          <span className="loading-spinner">↻</span>
          Updating...
        </div>
      )}
      
      {error && (
        <div className="status-indicator error">
          <span className="error-icon">⚠</span>
          {error}
          <button onClick={onRefresh} className="refresh-btn">
            Retry
          </button>
        </div>
      )}
      
      {isStale && !error && (
        <div className="status-indicator stale">
          <span className="stale-icon">⚡</span>
          Data may be outdated
          <button onClick={onRefresh} className="refresh-btn">
            Refresh Now
          </button>
        </div>
      )}
      
      {!isLoading && !error && !isStale && lastUpdated && (
        <div className="status-indicator success">
          <span className="success-icon">✓</span>
          Last updated: {formatLastUpdated()}
        </div>
      )}
    </div>
  );
};

export default DataStatus;