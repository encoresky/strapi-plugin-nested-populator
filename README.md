# Strapi plugin nested populator
Unleash the full potential of your Strapi content with nested, customizable population!

## Features

  - Compatible with [strapi v5](https://docs.strapi.io) and lower strapi versions
  - Effortlessly populate nested content structures via REST API
  - Customize population depth on-the-fly
  - Works seamlessly with all collections and single types
  - Simple installation and configuration

## Installation

`npm i @encoreskytech/strapi-plugin-nested-populator`

`yarn add @encoreskytech/strapi-plugin-nested-populator`


## Usages

  - Deep populate with default depth

    `/api/pages?customPopulate=nested`

  - Specify custom depth

    `/api/pages?customPopulate=nested&customDepth=4`

  - Ignore custom properties

    `/api/pages?customPopulate=nested&customIgnored[]=images&customIgnored[]=videos`

## Good to know

  - Default maximum depth: 6 levels
  - Compatible with findOne and findMany methods
  - Depth easily customizable via API parameters or plugin configuration

## Configuration

Tailor the default depth to your needs by editing `config/plugins.js`

```
module.exports = ({ env }) => ({
  'strapi-plugin-nested-populator': {
    config: {
      defaultDepth: 4, // Default is 6
    }
  },
});
```

## Contributing

We welcome contributions! Feel free to open issues or submit pull requests to help improve this plugin.

## License

[MIT](https://github.com/encoresky/strapi-plugin-nested-populator/blob/main/LICENSE)
