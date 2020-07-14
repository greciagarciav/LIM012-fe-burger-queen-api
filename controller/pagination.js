module.exports.paginate = (req, page, limit, collection) => {
  const ip = req.ip ? req.ip : '';
  const fullUrl = `<${req.protocol}://${req.hostname}${ip}${req.path}`;
  let pagination;
  if (parseInt(page, 10) !== 1) {
    pagination += `${fullUrl}?page=1&limit=${limit}>; rel="first",`;
  }
  if (parseInt(page, 10) !== collection.totalPages) {
    pagination += `${fullUrl}?page=${collection.totalPages}&limit=${limit}>; rel="last",`;
  }
  if (collection.hasNextPage) {
    pagination += `${fullUrl}?page=${collection.nextPage}&limit=${limit}>; rel="next",`;
  }
  if (collection.hasPrevPage) {
    pagination += `${fullUrl}?page=${collection.prevPage}&limit=${limit}>; rel="prev",`;
  }
  return pagination;
};
