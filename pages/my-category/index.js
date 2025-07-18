import Link from 'next/link';

export const getServerSideProps = async () => {
  return {
    props: {
      title: 'My Category',
      content: 'This is content for My Category',
      timestamp: new Date().toISOString(),
    },
  };
};

export default function MyCategory({ title, content, timestamp }) {
  return (
    <div>
      <h1>{title}</h1>
      <br />
      <p>{content}</p>
      <br />
      <p>Generated at: {timestamp}</p>
      <br />
      <p>
        View our{' '}
        <Link href="/my-category/products">
          <span style={{ color: 'blue', textDecoration: 'underline' }}>
            product listing
          </span>
        </Link>
        .
      </p>
    </div>
  );
}

