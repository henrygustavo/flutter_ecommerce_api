'use strict';

/**
 * Transfer.js controller
 *
 * @description: A set of functions called "actions" for managing `Transfer`.
 */

module.exports = {

  /**
   * Retrieve transfer records.
   *
   * @return {Object|Array}
   */

  find: async (ctx, next, { populate } = {}) => {
    if (ctx.query._q) {
      return strapi.services.transfer.search(ctx.query);
    } else {
      return strapi.services.transfer.fetchAll(ctx.query, populate);
    }
  },

  /**
   * Retrieve a transfer record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    return strapi.services.transfer.fetch(ctx.params);
  },

  /**
   * Count transfer records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.transfer.count(ctx.query);
  },

  /**
   * Create a/an transfer record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.transfer.add(ctx.request.body);
  },

  /**
   * Update a/an transfer record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.transfer.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an transfer record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.transfer.remove(ctx.params);
  }
};
