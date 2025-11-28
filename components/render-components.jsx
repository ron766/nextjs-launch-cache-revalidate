import React from 'react';

import Section from './section';
import HeroBanner from './hero-banner';
import BlogBanner from './blog-banner';
import BlogSection from './blog-section';

export default function RenderComponents(props) {
  const {
    pageComponents,
    blogPost,
    entryUid,
    contentTypeUid,
    locale,
    cacheStatus,
    statusCode
  } = props;
  return (
    <div
      data-pageref={entryUid}
      data-contenttype={contentTypeUid}
      data-locale={locale}
    >
      {pageComponents?.map((component, key) => {
        if (component.hero_banner) {
          return blogPost ? (
            <BlogBanner
              blogBanner={component.hero_banner}
              key={`component-${key}`}
              cacheStatus={cacheStatus}
              statusCode={statusCode}
            />
          ) : (
            <HeroBanner
              banner={component.hero_banner}
              key={`component-${key}`}
              cacheStatus={cacheStatus}
              statusCode={statusCode}
            />
          );
        }
        if (component.section) {
          return (
            <Section section={component.section} key={`component-${key}`} />
          );
        }
        if (component.from_blog) {
          return (
            <BlogSection
              fromBlog={component.from_blog}
              key={`component-${key}`}
            />
          );
        }
      })}
    </div>
  );
}
