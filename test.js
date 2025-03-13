const { ethers } = require("ethers");

try {
  const addr = "0x5e9077585ffe036f72aa49845af362f5509c8f";
  const checksummed = ethers.getAddress(addr);
  console.log("Valid address:", checksummed);
} catch (error) {
  console.error("Invalid address:", error);
}
