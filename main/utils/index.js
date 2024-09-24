const { isEmpty, merge } = require("lodash/fp");

const extractModelAttributes = (model) => {
  // Remove 'related' field for 'upload.file', return other attributes.
  if (model.uid === "plugin::upload.file") {
    const { related, ...attributes } = model.attributes;
    return attributes;
  }
  return model.attributes;
};

const buildPopulateTree = (modelUid, maxDepth = 20, ignore = []) => {
  const skipCreatorFields = strapi
    .plugin('@encoreskytech/strapi-plugin-nested-populator')
    ?.config('skipCreatorFields');

  // Base conditions to terminate recursion.
  if (maxDepth <= 1) return true;
  if (modelUid === "admin::user" && skipCreatorFields) return undefined;

  const populate = {};
  const model = strapi.getModel(modelUid);

  // Add model's collection name to ignore list if not already present.
  if (!ignore.includes(model.collectionName)) {
    ignore.push(model.collectionName);
  }

  for (const [key, value] of Object.entries(extractModelAttributes(model))) {
    if (ignore.includes(key)) continue;

    if (value) {
      switch (value.type) {
        case "component":
          populate[key] = buildPopulateTree(value.component, maxDepth - 1);
          break;

        case "dynamiczone":
          const dynamicPopulate = value.components.reduce((acc, comp) => {
            const componentPopulate = buildPopulateTree(comp, maxDepth - 1);
            return componentPopulate === true ? acc : merge(acc, componentPopulate);
          }, {});
          populate[key] = isEmpty(dynamicPopulate) ? true : dynamicPopulate;
          break;

        case "relation":
          const relationPopulate = buildPopulateTree(
            value.target,
            key === "localizations" && maxDepth > 2 ? 1 : maxDepth - 1,
            ignore
          );
          if (relationPopulate) {
            populate[key] = relationPopulate;
          }
          break;

        case "media":
          populate[key] = true;
          break;

        default:
          break;
      }
    }
  }

  // Return the full populate object or true if no populates were added.
  return isEmpty(populate) ? true : { populate };
};

module.exports = {
  buildPopulateTree
};
