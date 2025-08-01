import React, { useEffect, useState } from 'react';
import moment from 'moment';
import parse from 'html-react-parser';
import { getPageRes, getBlogPostRes } from '../../helper';
import { onEntryChange } from '../../contentstack-sdk';
import Skeleton from 'react-loading-skeleton';
import RenderComponents from '../../components/render-components';
import ArchiveRelative from '../../components/archive-relative';


export default function BlogPost({ blogPost, pageUrl }) {
  
  const [getPost, setPost] = useState({ post: blogPost });
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
            <h2 {...post.$?.title}>{post.title}</h2>
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

    return {
      props: {
        pageUrl: `/blog/${params.post}`,
        blogPost: posts,
        // page,
      },
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
}
