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

    // Get the response status code (defaults to 200 if not set)
    const statusCode = res.statusCode || 200;
    console.log('Response status code from getServerSideProps:', statusCode);

    return {
      props: {
        pageUrl: resolvedUrl,
        page,
        timestamp: new Date().toISOString(),
        statusCode,
      },
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
};

export default function Home({ page, pageUrl, timestamp, statusCode: serverStatusCode }) {
  const [cacheStatus, setCacheStatus] = useState(null);

  useEffect(() => {
    // Fetch the page to check cf-cache-status header
    fetch(window.location.href, { 
      method: 'GET',
      cache: 'default'
    })
      .then((response) => {
        const status = response.headers.get('cf-cache-status');
        console.log('cf-cache-status:', status);
        console.log('Response status from getServerSideProps:', serverStatusCode);
        setCacheStatus(status);
      })
      .catch((error) => {
        console.error('Error fetching cache status:', error);
      });
  }, [serverStatusCode]);

  return (
    <div>
      <h1>
        {page?.title || 'Home'}
        {(cacheStatus || serverStatusCode) && (
          <span style={{ marginLeft: '10px', fontSize: '0.6em' }}>
            (cf-cache-status: {cacheStatus || 'N/A'}, status: {serverStatusCode || 'N/A'})
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

