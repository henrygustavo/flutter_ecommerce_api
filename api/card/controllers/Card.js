"use strict";

const stripe = require("stripe")("sk_test_wPXtCKHyRKCLoa1GTKzOv9t800GFnzwFNM");

/**
 * A set of functions called "actions" for `Card`
 */

module.exports = {
  index: async ctx => {
    const customerId = ctx.request.querystring;
    const customerData = await stripe.customers.retrieve(customerId);
    const cardData = customerData.sources.data;
    ctx.send(cardData);
    // ctx.send("hello world");
  },
  add: async ctx => {
    const { customer, source } = ctx.request.body;
    const card = await stripe.customers.createSource(customer, { source });
    ctx.send(card);
  }
};
