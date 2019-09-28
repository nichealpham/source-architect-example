module.exports = {
    restApiRoot: "/payment",
    host: "0.0.0.0",
    port: process.env.PORT || 4006,
    remoting: {
        context: false,
        rest: {
            handleErrors: true,
            normalizeHttpPath: false,
            xml: true
        },
        json: {
            strict: false,
            limit: '200mb'
        },
        urlencoded: {
            extended: true,
            limit: '100kb'
        },
    },
    swagger: {
        protocol: 'https'
    },
    httpMode: true
}