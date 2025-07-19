
export const getServerSideProps = async () => {
  return {
    props: {
      title: 'Blog',
      content: 'This is content for Blog',
      timestamp: new Date().toISOString(),
    },
  };
};

export default function Blog({ title, content, timestamp }) {
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

