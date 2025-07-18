
export const getServerSideProps = async () => {
  return {
    props: {
      title: 'My Blog Post',
      content: 'This is content for My Blog Post',
      timestamp: new Date().toISOString(),
    },
  };
};

export default function MyBlogPost({ title, content, timestamp }) {
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

