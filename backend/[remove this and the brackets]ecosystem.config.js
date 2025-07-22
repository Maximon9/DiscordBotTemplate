module.exports = {
    apps: [
        {
            name: "backend-bot",
            script: "./dist/server.js",
            cwd: __dirname,
            watch: false,
            env: {
                NODE_ENV: "production",
                CLIENT_TOKEN: "The discord bot token",
                GITHUB_WEBHOOK_SECRET: "The webhook secret",
                PORT: 3000,
            },
        },
    ],
};
