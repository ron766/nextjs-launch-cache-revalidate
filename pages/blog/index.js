import React, { useState, useEffect } from 'react';
import { onEntryChange } from '../../contentstack-sdk';
import BlogList from '../../components/blog-list';
import RenderComponents from '../../components/render-components';
import { getPageRes, getBlogListRes } from '../../helper';

import ArchiveRelative from '../../components/archive-relative';
import Skeleton from 'react-loading-skeleton';


export default function Blog({ page, posts, archivePost, pageUrl }) {

  const [getBanner, setBanner] = useState(page);
  const [cacheStatus, setCacheStatus] = useState(null);
  const [statusCode, setStatusCode] = useState(null);

  async function fetchData() {
    try {
      const bannerRes = await getPageRes(pageUrl);
      if (!bannerRes) throw new Error('Status code 404');
      setBanner(bannerRes);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    onEntryChange(() => fetchData());
  }, []);

  useEffect(() => {
    // Get the actual response status from the initial page load (matches network tab)
    const navigationEntry = performance.getEntriesByType('navigation')[0];
    
    if (navigationEntry) {
      // Check if responseStatus is available (some browsers don't support it)
      let actualStatus = navigationEntry.responseStatus;
      
      // If responseStatus is not available or shows 200, check for 304 indicators:
      // - transferSize === 0 indicates served from cache (304 response has no body)
      // - Very fast response time also indicates cache
      if (!actualStatus || actualStatus === 200) {
        if (navigationEntry.transferSize === 0 && navigationEntry.decodedBodySize > 0) {
          // Served from cache - likely a 304 response
          actualStatus = 304;
        }
      }
      
      if (actualStatus !== null && actualStatus !== undefined) {
        setStatusCode(actualStatus);
        console.log('Actual response status (from network tab):', actualStatus);
        console.log('transferSize:', navigationEntry.transferSize);
        console.log('decodedBodySize:', navigationEntry.decodedBodySize);
      }
    }

    // Fetch the page to check cf-cache-status header
    fetch(window.location.href, { 
      method: 'GET',
      cache: 'default'
    })
      .then((response) => {
        const status = response.headers.get('cf-cache-status');
        console.log('cf-cache-status:', status);
        setCacheStatus(status);
      })
      .catch((error) => {
        console.error('Error fetching cache status:', error);
      });
  }, []);
  return (
    <>
      {getBanner.page_components ? (
        <RenderComponents
          pageComponents={getBanner.page_components}
          blogPost
          contentTypeUid='page'
          entryUid={getBanner.uid}
          locale={getBanner.locale}
          cacheStatus={cacheStatus}
          statusCode={statusCode}
        />
      ) : (
        <Skeleton height={400} />
      )}
      <div className='blog-container'>
        <div className='blog-column-left'>
          {posts ? (
            posts.map((blogList, index) => (
              <BlogList bloglist={blogList} key={index} />
            ))
          ) : (
            <Skeleton height={400} width={400} count={3} />
          )}
        </div>
        <div className='blog-column-right'>
          {getBanner && getBanner.page_components[1].widget && (
            <h2>
              {getBanner.page_components[1].widget.title_h2}
              {/* {(cacheStatus || statusCode) && (
                <span style={{ marginLeft: '10px', fontSize: '0.6em', color: '#666' }}>
                  (cf-cache-status: {cacheStatus || 'N/A'}, status: {statusCode || 'N/A'})
                </span>
              )} */}
            </h2>
          )}
          {archivePost ? (
            <ArchiveRelative blogs={archivePost} />
          ) : (
            <Skeleton height={600} width={300} />
          )}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { res } = context;

  res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=86400');
  res.setHeader('Cache-Tag', context.resolvedUrl.replace('/', ''));
  res.setHeader('Cache-Tag-Debug', context.resolvedUrl.replace('/', ''));

  console.log('BLOG - 72 context.resolvedUrl', context.resolvedUrl);

  try {
    const page = await getPageRes(context.resolvedUrl);
    const result = await getBlogListRes();

    const archivePost = [];
    const posts = [];
    result.forEach((blogs) => {
      if (blogs.is_archived) {
        archivePost.push(blogs);
      } else {
        posts.push(blogs);
      }
    });
    
    return {
      props: {
        pageUrl: context.resolvedUrl,
        page,
        posts,
        archivePost,
      },
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
}
