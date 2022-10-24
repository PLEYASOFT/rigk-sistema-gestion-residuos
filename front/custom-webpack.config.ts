const { EnvironmentPlugin } = require('webpack');
// Add additional requirements here

// If you're using dotenv
require('dotenv').config()

// Export a configuration object
// See [Wepack's documentation](https://webpack.js.org/configuration/) for additional ideas of how to 
// customize your build beyond what Angular provides.
module.exports = {
  plugins: [
    new EnvironmentPlugin([
      'API_KEY',
      'URL_BASE',
      'IPUSUARIO',
      'NOMBREEQUIPO',
      'SESIONACCESO',
      'VERSION_X',
      'VERSION_Y',
      'USER_LOGIN',
      'PASSWD_LOGIN'
    ])
]
}

