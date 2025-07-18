export default async function handler(req, res) {
  const { path, prefix } = req.query;

  if (!path) {
    return res.status(400).json({ error: 'Missing revalidation path' });
  }

  try {
    const pathsToRevalidate = prefix === 'true'
      ? getPathsForPrefix(path)
      : [path];

    for (const p of pathsToRevalidate) {
      await res.revalidate(p);
    }

    return res.json({ revalidated: pathsToRevalidate });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to revalidate', details: err });
  }
}

function getPathsForPrefix(prefix) {
  const allPaths = [
    '/blog',
    '/blog/post1',
    '/blog/post2',
    '/blog/my-blog-post',
    '/my-category',
    '/my-category/products',
  ];
  return allPaths.filter((p) => p.startsWith(prefix));
}
