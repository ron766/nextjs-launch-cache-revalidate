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
    // Fetch the page to check cf-cache-status header
    fetch(window.location.href, { method: 'HEAD' })
      .then((response) => {
        const status = response.headers.get('cf-cache-status');
        console.log('cf-cache-status:', status);
        console.log('Response status:', response.status);
        setCacheStatus(status);
        setStatusCode(response.status);
      })
      .catch((error) => {
        console.error('Error fetching cache status:', error);
      });
  }, []);

  return (
    <div>
      <h1>
        {page?.title || 'Home'}
        {(cacheStatus || statusCode) && (
          <span style={{ marginLeft: '10px', fontSize: '0.6em' }}>
            (cf-cache-status: {cacheStatus || 'N/A'}, status: {statusCode || 'N/A'})
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

