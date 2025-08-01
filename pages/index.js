
export const getServerSideProps = async () => {
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

