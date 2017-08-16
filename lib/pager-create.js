export const pagerCreate = (model, populate='') => (req, query={}, sortBy={}) => {
  let offset = (Number(req.query.page) - 1) || 0;
  let itemLimit = 100;
  let route = `${process.env.API_URL}/${model.modelName}s?page=`;
  return model.count()
    .then(count => {
      let remaining = count - offset * itemLimit;
      return model.find(query)
        .sort(sortBy)
        .populate(populate)
        .skip(offset > 0 ? offset * itemLimit : 0)
        .limit(itemLimit)
        .then(data => ({
          count: count,
          data: data,
          last: `${route}${Math.floor((count - 1) / itemLimit) + 1}`,
          prev: offset > 0 && remaining > 0  ? `${route}${offset}` : null,
          next: offset > -1 && remaining > itemLimit ? `${route}${offset + 2}` : null,
        }));
    });
};
