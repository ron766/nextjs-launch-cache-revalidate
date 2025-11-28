import React, { useEffect, useState } from 'react';
import moment from 'moment';
import parse from 'html-react-parser';
import { getPageRes, getBlogPostRes } from '../../helper';
import { onEntryChange } from '../../contentstack-sdk';
import Skeleton from 'react-loading-skeleton';
import RenderComponents from '../../components/render-components';
import ArchiveRelative from '../../components/archive-relative';


export default function BlogPost({ blogPost, pageUrl, statusCode: serverStatusCode }) {
  
  const [getPost, setPost] = useState({ post: blogPost });
  const [cacheStatus, setCacheStatus] = useState(null);

  async function fetchData() {
    try {
      const entryRes = await getBlogPostRes(pageUrl);
      if (!entryRes) throw new Error('Status: ' + 404);
      setPost({ post: entryRes });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    onEntryChange(() => fetchData());
  }, [blogPost]);

  useEffect(() => {
    // Fetch the page to check cf-cache-status header
    fetch(window.location.href, { 
      method: 'GET',
      cache: 'default'
    })
      .then((response) => {
        const status = response.headers.get('cf-cache-status');
        console.log('cf-cache-status:', status);
        console.log('Response status from getServerSideProps:', serverStatusCode);
        setCacheStatus(status);
      })
      .catch((error) => {
        console.error('Error fetching cache status:', error);
      });
  }, [serverStatusCode]);

  const { post, banner } = getPost;
  return (
    <>
      {/* {banner ? (
        <RenderComponents
          pageComponents={banner.page_components}
          blogPost
          contentTypeUid='blog_post'
          entryUid={banner?.uid}
          locale={banner?.locale}
        />
      ) : (
        <Skeleton height={400} />
      )} */}
      <div className='blog-container'>
        <article className='blog-detail'>
          {post && post.title ? (
            <h2 {...post.$?.title}>
              {post.title}
              {(cacheStatus || serverStatusCode) && (
                <span style={{ marginLeft: '10px', fontSize: '0.6em', color: '#666' }}>
                  (cf-cache-status: {cacheStatus || 'N/A'}, status: {serverStatusCode || 'N/A'})
                </span>
              )}
            </h2>
          ) : (
            <h2>
              <Skeleton />
            </h2>
          )}
          {post && post.date ? (
            <p {...post.$?.date}>
              {moment(post.date).format('ddd, MMM D YYYY')},{' '}
              <strong {...post.author[0].$?.title}>
                {post.author[0].title}
              </strong>
            </p>
          ) : (
            <p>
              <Skeleton width={300} />
            </p>
          )}
          {post && post.body ? (
            <div {...post.$?.body}>{parse(post.body)}</div>
          ) : (
            <Skeleton height={800} width={600} />
          )}
        </article>
        <div className='blog-column-right'>
          <div className='related-post'>
            {banner && banner?.page_components[2].widget ? (
              <h2 {...banner?.page_components[2].widget.$?.title_h2}>
                {banner?.page_components[2].widget.title_h2}
              </h2>
            ) : (
              <h2>
                <Skeleton />
              </h2>
            )}
            {post && post.related_post ? (
              <ArchiveRelative
                {...post.$?.related_post}
                blogs={post.related_post}
              />
            ) : (
              <Skeleton width={300} height={500} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
export async function getServerSideProps({ params, res }) {
  res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=86400');
  res.setHeader('Cache-Tag', params.post);
  res.setHeader('Cache-Tag-Debug', params.post);

  try {
    // const page = await getPageRes('/blog');
    const posts = await getBlogPostRes(`/blog/${params.post}`);
    // if (!page || !posts) throw new Error('404');
    if (!posts) throw new Error('404');

    // Get the response status code (defaults to 200 if not set)
    const statusCode = res.statusCode || 200;
    console.log('Response status code from getServerSideProps:', statusCode);

    return {
      props: {
        pageUrl: `/blog/${params.post}`,
        blogPost: posts,
        statusCode,
        // page,
      },
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
}
