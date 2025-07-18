
export const getServerSideProps = async () => {
  return {
    props: {
      title: 'Products',
      content: 'This is content for Products',
      timestamp: new Date().toISOString(),
    },
  };
};

export default function Products({ title, content, timestamp }) {
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

