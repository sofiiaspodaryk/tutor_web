// .eslintrc.js
module.exports = {
  rules: {
    "no-restricted-modules": ["error", {
      "paths": [{
        "name": "punycode",
        "message": "This module is deprecated."
      }]
    }]
  }
};
