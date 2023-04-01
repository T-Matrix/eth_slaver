import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';

// import { MockUSDCABI } from './ContractABI/MockUSDC.sol/MockUSDC.json';

const MockUSDCABI = require('./ContractABI/MockUSDC.sol/MockUSDC.json');
const ERC20ContractAddress = '0x8e0a936ec7ef23ef2a06bb9cdb628ee6ff29cd7d';

const MintUSDC = (props) => {

    const connectToMetamaskUsingEthers = async(userAddress) => {

        console.log(`connectToMetamaskUsingEthers called address is : ${userAddress}`);
        if (userAddress) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            
            const contractAbi = MockUSDCABI.abi;
            const signer = await provider.getSigner();
            // provider or signer
            const ERC20Contract = new ethers.Contract(ERC20ContractAddress, contractAbi, signer);

            // Retrieve balance of ERC20 token for user's address
            const balance = await ERC20Contract.balanceOf(userAddress);
            // balance 本来就是 bigNumber，但是需要转一次: --> string --> bignumber
            const weiNumber = new BigNumber(balance.toString());
            // Retrieve token symbol
            const symbol = await ERC20Contract.symbol();
            const ethVal = weiNumber.dividedBy(new BigNumber('10').pow(6));
            console.log(`Balance of ${symbol}: ${ethVal.toString()}`);

            setMockUSDCContract(ERC20Contract);
            setMockUSDCBalance(ethVal.toString());
        }
    };

    const [userAccountAddress, setUserAccountAddress] = useState(props.accountInfo); 
    const [mockUSDCContract, setMockUSDCContract] = useState(props.accountInfo); 
    const [mockUSDCBalance, setMockUSDCBalance] = useState('0'); 

    useEffect(() => {
        setUserAccountAddress(props.accountInfo);
        connectToMetamaskUsingEthers(props.accountInfo);
    }, [props.accountInfo]);

    const handleButtonClick = async (amount) => {
        console.log('button clicked: ', amount);
        if (userAccountAddress && window.ethereum && !isNaN(amount)) {
            const weiValue = new BigNumber(amount).times(10 ** 6);
            try {
                const result = await mockUSDCContract.mint(userAccountAddress, weiValue.toString());
                console.log(result);
            } catch (err) {
                console.log('encountered an error', err);
            }

        } else {
            console.log('is nan: ', isNaN(amount));
        }
    }

    return (
        <div>
        <div> balance of USDC: { mockUSDCBalance }</div>
        <br/>
        <div> USDC币地址:{ ERC20ContractAddress }</div>
        <span> mint 测试 USDC 币 </span>
        <div><button onClick={ () => handleButtonClick(100999998) }>mint 100999998 个</button></div>
        </div>
	);
}

export default MintUSDC;