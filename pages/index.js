import { getPageRes } from '../helper';

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
  return (
    <div>
      <h1>{page?.title || 'Home'}</h1>
      <br />
      <p>{page?.content || 'This is content for Home'}</p>
      <br />
      <p>Generated at: {timestamp}</p>
    </div>
  );
}

