import React from 'react';

export default function BlogBanner({ blogBanner, cacheStatus, statusCode }) {
  return (
    <div
      className='blog-page-banner'
      style={{
        background: `${blogBanner.bg_color ? blogBanner.bg_color : ''}`,
      }}
    >
      <div className='blog-page-content'>
        {blogBanner.banner_title && (
          <h1 className='hero-title' {...blogBanner.$?.banner_title}>
            {blogBanner.banner_title}
            {(cacheStatus || statusCode) && (
              <span style={{ marginLeft: '10px', fontSize: '16px' }}>
                (cf-cache-status: {cacheStatus || 'N/A'}, status: {statusCode || 'N/A'})
              </span>
            )}
          </h1>
        )}

        {blogBanner.banner_description && (
          <p className='hero-description' {...blogBanner.$?.banner_description}>
            {blogBanner.banner_description}
          </p>
        )}
      </div>
    </div>
  );
}
