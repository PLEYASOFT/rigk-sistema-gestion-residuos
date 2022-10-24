export const environment_custom = {
    production: false,
    apy_key: process.env["API_KEY"] as string,
    url_base: process.env["URL_BASE"] as string,
    ipusuario: process.env["IPUSUARIO"] as string,
    nombreequipo: process.env["NOMBREEQUIPO"] as string,
    sesionacceso: process.env["SESIONACCESO"] as string,
    version_x: process.env["VERSION_X"] as string,
    version_y:  process.env["VERSION_Y"] as string,
  };