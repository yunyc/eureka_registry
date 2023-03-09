const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

const packageJson = require('../package.json');
const appVersion = packageJson.version;

module.exports = ({ serve }) => {
  return {
    optimization: {
      moduleIds: 'named',
      chunkIds: 'named',
      runtimeChunk: false,
    },
    plugins: [
      new ModuleFederationPlugin({
        shareScope: 'default',
        remotes: {
          '@gateway': `gateway@/services/gateway/remoteEntry.js`,
        },
        shared: {
          axios: { singleton: true, shareScope: 'default' },
          'vue-loader': { eager: true, singleton: false, shareScope: 'default' },
          'bootstrap-vue': { singleton: true, shareScope: 'default' },
          vue: { singleton: true, shareScope: 'default' },
          vuelidate: { singleton: true, shareScope: 'default' },
          'vue-class-component': { singleton: true, shareScope: 'default' },
          'vue-i18n': { singleton: true, shareScope: 'default' },
          'vue-router': { singleton: true, shareScope: 'default' },
          'vue2-filters': { singleton: true, shareScope: 'default' },
          vuex: { singleton: true, shareScope: 'default' },
          'vue-property-decorator': { singleton: true, shareScope: 'default' },
          '@/shared/security/authority': {
            singleton: true,
            shareScope: 'default',
            import: '@/shared/security/authority',
            requiredVersion: appVersion,
          },
          '@/shared/alert/alert.service': {
            singleton: true,
            shareScope: 'default',
            import: '@/shared/alert/alert.service',
            requiredVersion: appVersion,
          },
          '@/locale/translation.service': {
            singleton: true,
            shareScope: 'default',
            import: '@/locale/translation.service',
            requiredVersion: appVersion,
          },
        },
      }),
    ],
    output: {
      publicPath: 'auto',
    },
  };
};
