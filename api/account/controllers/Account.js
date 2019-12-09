'use strict';

/**
 * Account.js controller
 *
 * @description: A set of functions called "actions" for managing `Account`.
 */

module.exports = {

  /**
   * Retrieve account records.
   *
   * @return {Object|Array}
   */

  find: async (ctx, next, { populate } = {}) => {
    if (ctx.query._q) {
      return strapi.services.account.search(ctx.query);
    } else {
      return strapi.services.account.fetchAll(ctx.query, populate);
    }
  },

  /**
   * Retrieve a account record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    return strapi.services.account.fetch(ctx.params);
  },

  /**
   * Count account records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.account.count(ctx.query);
  },

  /**
   * Create a/an account record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.account.add(ctx.request.body);
  },

  /**
   * Update a/an account record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.account.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an account record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.account.remove(ctx.params);
  }
};
