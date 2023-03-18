module.exports = (req, res, next) => {
  const startTime = Date.now();
  res.on('finish', () => {
    const diff = Date.now() - startTime;
    console.log('video load took', diff, 'ms');
  });
  next();
};
