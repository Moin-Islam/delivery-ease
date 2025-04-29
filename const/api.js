// const protocol = 'https://';
// const agarhHost = 'api.agarh.net';
// const devHost = 'msdistribution.starit-ltd.xyz'
// const ftalalHost = 'api.ftalal.net'
// const alinsafHost = 'msdistribution.starit-ltd.xyz'
const protocol = process.env.PROTOCOL
const apiHost = process.env.API_HOST_URL
const api = '/api';

 const baseUrl = `${protocol + process.env.API_HOST_URL + api}`;

const webUrl = `${protocol + process.env.API_HOST_URL}`;

console.log(baseUrl)

export { baseUrl, webUrl}
