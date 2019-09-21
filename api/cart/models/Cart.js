module.exports = {
  update(ctx) {
    const { products } = ctx.request.body;
    console.log('products', products);
    return strapi.services.cart.update(ctx.params, { products: JSON.parse(products) });
  },
};