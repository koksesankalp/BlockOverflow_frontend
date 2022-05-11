export const Framework = require("@superfluid-finance/sdk-core");
export const ethers = require("ethers");

// Ethers.js provider initialization
export const url =
  "https://eth-rinkeby.alchemyapi.io/v2/iNNs24vbZthCgoM1DdYfs44KxP-re35d";
export const customHttpProvider = new ethers.providers.JsonRpcProvider(url);
