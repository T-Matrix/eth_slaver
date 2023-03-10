
const { ethers } = require('hardhat');

async function main() {
    const contractFactory = await ethers.getContractFactory("MockUSDC");
    // 指定 gas fee
    // const argus = {
    //   gasPrice: ethers.utils.parseUnits('60', 'gwei'),
    // };
    const deployedContract = await contractFactory.deploy();
    // 部署，会返回一个 Promise<Contract>
    await deployedContract.deployed();
  
    console.log(
      `Contract deployed to: \n 
    https://goerli.etherscan.io/address/${deployedContract.address}`,
  
    );
  }
    
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });