import React from 'react';
import TabViews from './TabViews';

const ResultSection = ({ location }) => {
  return (
    <div className="resultContainer">
      <TabViews location={location} />
    </div>
  );
};

export default ResultSection;
