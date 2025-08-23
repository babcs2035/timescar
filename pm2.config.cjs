module.exports = {
  apps: [
    {
      name: 'timescar',
      script:
        'export `cat .env` && PORT=3200 ~/.volta/bin/node standalone/server.js ',
    },
  ],
};
