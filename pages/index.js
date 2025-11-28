import { getPageRes } from '../helper';
import { useEffect, useState } from 'react';

export const getServerSideProps = async ({ res, resolvedUrl }) => {
  res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=86400');
  res.setHeader('Cache-Tag', 'home');
  res.setHeader('Cache-Tag-Debug', 'home');

  console.log('HOME - 7 resolvedUrl', resolvedUrl);

  try {
    const page = await getPageRes(resolvedUrl);
    if (!page) throw new Error('404');

    return {
      props: {
        pageUrl: resolvedUrl,
        page,
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
};

export default function Home({ page, pageUrl, timestamp }) {
  const [cacheStatus, setCacheStatus] = useState(null);
  const [statusCode, setStatusCode] = useState(null);

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
    <div>
      <h1>
        {page?.title || 'Home'}
        {(cacheStatus || statusCode !== null) && (
          <span style={{ marginLeft: '10px', fontSize: '0.6em' }}>
            (cf-cache-status: {cacheStatus || 'N/A'}, status: {statusCode !== null ? statusCode : 'N/A'})
          </span>
        )}
      </h1>
      <br />
      <p>{page?.content || 'This is content for Home'}</p>
      <br />
      <p>Generated at: {timestamp}</p>
    </div>
  );
}

