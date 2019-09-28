const webpack = require('webpack');

module.exports = {
    env: {
        NODE_ENV: process.env.NODE_ENV || ''
    },
    modules: [
        'bootstrap-vue/nuxt',
        '@nuxtjs/moment',
    ],
    head: {
        title: 'Cassandra Console',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: 'Cassandra Console' }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: 'https://firebasestorage.googleapis.com/v0/b/cassandra-c8497.appspot.com/o/console%2Fassets%2Fglobal%2Fstartup.png?alt=media&token=a0bae3bb-20ab-4e3d-aec3-89ac43d93ea9' },
            { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Montserrat|Ubuntu' },
            { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Alfa+Slab+One' },
            { rel: 'stylesheet', href: 'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css', integrity: 'sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN', crossorigin: 'anonymous' },
            { rel: 'stylesheet', href: '//cdn.jsdelivr.net/chartist.js/latest/chartist.min.css' },
        ]
    },
    css: [
        '~/assets/css/global.css',
        '~/assets/css/bootstrap.css',
        '~/assets/css/scrollbar.css',
        '~/assets/css/cassandra.css',
        '~/assets/css/paper.css',
    ],
    plugins: [
        { src: '~/plugins/service' },
        { src: '~/plugins/chartist', ssr: false },
        { src: '~/plugins/event-bus', ssr: false },
        { src: '~/plugins/vue-cookie', ssr: false }
    ],
    loading: '~/components/global/Loading.vue',
    build: {
        extractCSS: true,
        vendor: [
            'axios',
            'jquery',
            'vue-cookie',
        ],
        publicPath: `/pub/`,
        plugins: [
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                'window.jQuery': 'jquery'
            })
        ],
    },
    render: {
        etag: false,
        gzip: { threshold: 1073741824 },
    },
    srcDir: 'src/',
    performance: {
        gzip: false
    },
    router: {
        base: '/'
    },
    dev: false
};

