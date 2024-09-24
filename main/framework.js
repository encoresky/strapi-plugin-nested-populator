'use strict';

const { buildPopulateTree } = require('./utils');

module.exports = ({ strapi }) => {
  // Subscribe to the relevant lifecycle events.
  strapi.db.lifecycles.subscribe((event) => {
    const { action, params, model } = event;

    // Only proceed for 'beforeFindMany' or 'beforeFindOne' actions.
    if (action === 'beforeFindMany' || action === 'beforeFindOne') {
      const { customPopulate, customDepth } = params || {};

      // Get the default depth from plugin config, fallback to 5 if undefined.
      const defaultDepth = strapi
        .plugin('@encoreskytech/strapi-plugin-nested-populator')
        ?.config('defaultDepth') || 5;

      // Apply population logic if 'nested' population is requested.
      if (customPopulate === 'nested') {
        const depth = customDepth > 0 ? customDepth : defaultDepth;
        const modelObject = buildPopulateTree(model.uid, depth, []);

        // Update the event params with the computed population object.
        params.populate = modelObject.populate;
      }
    }
  });
};
