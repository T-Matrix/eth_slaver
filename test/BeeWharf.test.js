const { ethers } = require("hardhat");
// const { expect } = require("chai");

describe("BeeWharf", function() {
    let myContract;

    beforeEach(async function() {
        const contractFactory = await ethers.getContractFactory("BeeWharf");
        myContract = await contractFactory.deploy();
        await myContract.deployed();
    });
});