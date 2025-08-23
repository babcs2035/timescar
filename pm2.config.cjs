module.exports = {
  apps: [
    {
      name: 'timescar',
      script:
        'export `cat .env` && PORT=2000 ~/.volta/bin/node standalone/server.js ',
    },
  ],
};
