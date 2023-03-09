import Vue from 'vue';
import Component from 'vue-class-component';
Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate', // for vue-router 2.2+
]);
import Router, { RouteConfig } from 'vue-router';

const Home = () => import('@/core/home/home.vue');
const Error = () => import('@/core/error/error.vue');
import admin from '@/router/admin';
import entities from '@/router/entities';
import pages from '@/router/pages';

Vue.use(Router);

// prettier-ignore
const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/forbidden',
      name: 'Forbidden',
      component: Error,
      meta: { error403: true }
    },
    {
      path: '/not-found',
      name: 'NotFound',
      component: Error,
      meta: { error404: true }
    },
    ...admin,
    entities,
    ...pages
  ]
});

export const lazyRoutes = Promise.all([
  import('@gateway/entities-router')
    .then(gatewayRouter => {
      router.addRoute(gatewayRouter.default as RouteConfig);
      return gatewayRouter.default;
    })
    .catch(() => {
      console.log("Error loading gateway menus. Make sure it's up.");
    }),
]);

export default router;
