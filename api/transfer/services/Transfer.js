'use strict';

/* global Transfer */

/**
 * Transfer.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

// Public dependencies.
const _ = require('lodash');
const { convertRestQueryParams, buildQuery } = require('strapi-utils');

module.exports = {

  /**
   * Promise to fetch all transfers.
   *
   * @return {Promise}
   */

  fetchAll: (params, populate) => {
    const filters = convertRestQueryParams(params);
    const populateOpt = populate || Transfer.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias)

    return buildQuery({
      model: Transfer,
      filters,
      populate: populateOpt,
    });
  },

  /**
   * Promise to fetch a/an transfer.
   *
   * @return {Promise}
   */

  fetch: (params) => {
    // Select field to populate.
    const populate = Transfer.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias)
      .join(' ');

    return Transfer
      .findOne(_.pick(params, _.keys(Transfer.schema.paths)))
      .populate(populate);
  },

  /**
   * Promise to count transfers.
   *
   * @return {Promise}
   */

  count: (params) => {
    const filters = convertRestQueryParams(params);

    return buildQuery({
      model: Transfer,
      filters: { where: filters.where },
    })
      .count()
  },

  /**
   * Promise to add a/an transfer.
   *
   * @return {Promise}
   */

  add: async (values) => {
    // Extract values related to relational data.
    const relations = _.pick(values, Transfer.associations.map(ast => ast.alias));
    const data = _.omit(values, Transfer.associations.map(ast => ast.alias));

    // Create entry with no-relational data.
    const entry = await Transfer.create(data);

    // Create relational data and return the entry.
    return Transfer.updateRelations({ _id: entry.id, values: relations });
  },

  /**
   * Promise to edit a/an transfer.
   *
   * @return {Promise}
   */

  edit: async (params, values) => {
    // Extract values related to relational data.
    const relations = _.pick(values, Transfer.associations.map(a => a.alias));
    const data = _.omit(values, Transfer.associations.map(a => a.alias));

    // Update entry with no-relational data.
    const entry = await Transfer.updateOne(params, data, { multi: true });

    // Update relational data and return the entry.
    return Transfer.updateRelations(Object.assign(params, { values: relations }));
  },

  /**
   * Promise to remove a/an transfer.
   *
   * @return {Promise}
   */

  remove: async params => {
    // Select field to populate.
    const populate = Transfer.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias)
      .join(' ');

    // Note: To get the full response of Mongo, use the `remove()` method
    // or add spent the parameter `{ passRawResult: true }` as second argument.
    const data = await Transfer
      .findOneAndRemove(params, {})
      .populate(populate);

    if (!data) {
      return data;
    }

    await Promise.all(
      Transfer.associations.map(async association => {
        if (!association.via || !data._id || association.dominant) {
          return true;
        }

        const search = _.endsWith(association.nature, 'One') || association.nature === 'oneToMany' ? { [association.via]: data._id } : { [association.via]: { $in: [data._id] } };
        const update = _.endsWith(association.nature, 'One') || association.nature === 'oneToMany' ? { [association.via]: null } : { $pull: { [association.via]: data._id } };

        // Retrieve model.
        const model = association.plugin ?
          strapi.plugins[association.plugin].models[association.model || association.collection] :
          strapi.models[association.model || association.collection];

        return model.update(search, update, { multi: true });
      })
    );

    return data;
  },

  /**
   * Promise to search a/an transfer.
   *
   * @return {Promise}
   */

  search: async (params) => {
    // Convert `params` object to filters compatible with Mongo.
    const filters = strapi.utils.models.convertParams('transfer', params);
    // Select field to populate.
    const populate = Transfer.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias)
      .join(' ');

    const $or = Object.keys(Transfer.attributes).reduce((acc, curr) => {
      switch (Transfer.attributes[curr].type) {
        case 'integer':
        case 'float':
        case 'decimal':
          if (!_.isNaN(_.toNumber(params._q))) {
            return acc.concat({ [curr]: params._q });
          }

          return acc;
        case 'string':
        case 'text':
        case 'password':
          return acc.concat({ [curr]: { $regex: params._q, $options: 'i' } });
        case 'boolean':
          if (params._q === 'true' || params._q === 'false') {
            return acc.concat({ [curr]: params._q === 'true' });
          }

          return acc;
        default:
          return acc;
      }
    }, []);

    return Transfer
      .find({ $or })
      .sort(filters.sort)
      .skip(filters.start)
      .limit(filters.limit)
      .populate(populate);
  }
};
