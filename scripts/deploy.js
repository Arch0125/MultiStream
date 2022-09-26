const hre = require('hardhat');

async function main(){

  const ERC1620 = await hre.ethers.getContractFactory('ERC1620');
  const erc1620 = await ERC1620.deploy();

  await erc1620.deployed();

  console.log('ERC1620 deployed to:', erc1620.address);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
})