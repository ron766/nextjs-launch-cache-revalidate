export const getServerSideProps = async ({ res, resolvedUrl }) => {
  res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=86400');
  res.setHeader('Cache-Tag', 'home');
  res.setHeader('Cache-Tag-Debug', 'home');

  console.log('HOME - 7 resolvedUrl', resolvedUrl);

  return {
    props: {
      title: 'Home',
      content: 'This is content for Home',
      timestamp: new Date().toISOString(),
    },
  };
};

export default function Home({ title, content, timestamp }) {
  return (
    <div>
      <h1>{title}</h1>
      <br />
      <p>{content}</p>
      <br />
      <p>Generated at: {timestamp}</p>
    </div>
  );
}

