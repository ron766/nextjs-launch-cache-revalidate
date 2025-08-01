import React from 'react';
import Link from 'next/link';

export default function Section({ section }) {
  function contentSection(key) {
    return (
      <div className='home-content' key={key}>
        {section.title_h2 && (
          <h2 {...section.$?.title_h2}>{section.title_h2}</h2>
        )}
        {section.description && (
          <p {...section.$?.description}>{section.description}</p>
        )}
        {section.call_to_action.title && section.call_to_action.href ? (
          (<Link
            href={section.call_to_action.href}
            className='btn secondary-btn'
            {...section.call_to_action.$?.title}>

            {section.call_to_action.title}

          </Link>)
        ) : (
          ''
        )}
      </div>
    );
  }

  function imageContent(key) {
    return (
      <img
        {...section.image.$?.url}
        src={section.image.url}
        alt={section.image.filename}
        key={key}
      />
    );
  }
  return (
    <div className='home-advisor-section'>
      {section.image_alignment === 'Left'
        ? [imageContent('key-image'), contentSection('key-contentstection')]
        : [contentSection('key-contentstection'), imageContent('key-image')]}
    </div>
  );
}
