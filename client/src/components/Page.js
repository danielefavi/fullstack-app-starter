import React from 'react';
import PropTypes from 'prop-types';

function Page({ title, children }) {
  return (
    <main className="page-container p-4">
      {title && <h2 className="page-title">{title}</h2>}
      <div className="page-content">
        {children}
      </div>
    </main>
  );
}

Page.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Page;