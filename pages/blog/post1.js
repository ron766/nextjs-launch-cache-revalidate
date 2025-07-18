
export const getServerSideProps = async () => {
  return {
    props: {
      title: 'Post1',
      content: 'This is content for Post1',
      timestamp: new Date().toISOString(),
    },
  };
};

export default function Post1({ title, content, timestamp }) {
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

