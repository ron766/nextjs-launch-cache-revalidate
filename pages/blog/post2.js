
export const getServerSideProps = async () => {
  return {
    props: {
      title: 'Post2',
      content: 'This is content for Post2',
      timestamp: new Date().toISOString(),
    },
  };
};

export default function Post2({ title, content, timestamp }) {
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

