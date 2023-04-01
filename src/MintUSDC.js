import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';

// import { MockUSDCABI } from './ContractABI/MockUSDC.sol/MockUSDC.json';

// USDC 和 USDT 的 ABI 是一样的
const MockUSDCABI = require('./ContractABI/MockUSDC.sol/MockUSDC.json');
const USDC_ContractAddress = '0x8e0a936ec7ef23ef2a06bb9cdb628ee6ff29cd7d';
const USDT_ContractAddress = '0x01a6C2503840450be140bB190b2C9DDa19392dF8';

const MintUSDC = (props) => {

    const [userAccountAddress, setUserAccountAddress] = useState(props.accountInfo); 

    const [mockUSDC_Contract, setMockUSDC_Contract] = useState(props.accountInfo); 
    const [mockUSDC_Balance, setMockUSDC_Balance] = useState('0'); 

    const [mockUSDT_Contract, setMockUSDT_Contract] = useState(props.accountInfo); 
    const [mockUSDT_Balance, setMockUSDT_Balance] = useState('0');

    const connectToMetamaskUsingEthers = async(userAddress) => {

        console.log(`connectToMetamaskUsingEthers called address is : ${userAddress}`);
        if (userAddress) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            
            const contractAbi = MockUSDCABI.abi;
            
            // USDC
            const signer = await provider.getSigner();
            const USDC_Contract = new ethers.Contract(USDC_ContractAddress, contractAbi, signer);
            // Retrieve balance of ERC20 token for user's address
            const balance = await USDC_Contract.balanceOf(userAddress);
            // balance 本来就是 bigNumber，但是需要转一次: --> string --> bignumber
            const weiNumber = new BigNumber(balance.toString());
            // Retrieve token symbol
            const symbol = await USDC_Contract.symbol();
            const ethVal = weiNumber.dividedBy(new BigNumber('10').pow(6));
            console.log(`Balance of ${symbol}: ${ethVal.toString()}`);
            
            setMockUSDC_Contract(USDC_Contract);
            setMockUSDC_Balance(ethVal.toString());

            // USDT
            const USDT_Contract = new ethers.Contract(USDT_ContractAddress, contractAbi, signer);
            // Retrieve balance of ERC20 token for user's address
            const balance1 = await USDT_Contract.balanceOf(userAddress);
            // balance 本来就是 bigNumber，但是需要转一次: --> string --> bignumber
            const weiNumber1 = new BigNumber(balance1.toString());
            // Retrieve token symbol
            const symbol1 = await USDT_Contract.symbol();
            const ethVal1 = weiNumber1.dividedBy(new BigNumber('10').pow(6));
            console.log(`Balance of ${symbol1}: ${ethVal1.toString()}`);

            setMockUSDT_Contract(USDT_Contract);
            setMockUSDT_Balance(ethVal1.toString());
            
        }
    };

    useEffect(() => {
        setUserAccountAddress(props.accountInfo);
        connectToMetamaskUsingEthers(props.accountInfo);
    }, [props.accountInfo]);

    const usdc_ButtonClick = async (amount) => {
        console.log('button clicked: ', amount);
        if (userAccountAddress && window.ethereum && !isNaN(amount)) {
            const weiValue = new BigNumber(amount).times(10 ** 6);
            try {
                const result = await mockUSDC_Contract.mint(userAccountAddress, weiValue.toString());
                console.log(result);
            } catch (err) {
                console.log('encountered an error', err);
            }

        } else {
            console.log('is nan: ', isNaN(amount));
        }
    }

    const usdt_ButtonClick = async (amount) => {
        console.log('button clicked: ', amount);
        if (userAccountAddress && window.ethereum && !isNaN(amount)) {
            const weiValue = new BigNumber(amount).times(10 ** 6);
            try {
                const result = await mockUSDT_Contract.mint(userAccountAddress, weiValue.toString());
                console.log(result);
            } catch (err) {
                console.log('encountered an error', err);
            }

        } else {
            console.log('is nan: ', isNaN(amount));
        }
    }

    return (
        <>
            <hr/>
            <div className='section-container' >
                <span className='section-title' > mint 测试 USDC 币 </span>
                <div className='section-address' > USDC 币地址: { USDC_ContractAddress }</div>
                <div className='section-balance'> balance of USDC: { mockUSDC_Balance }</div>
                <button className='section-button' onClick={ () => usdc_ButtonClick(1099998) }>mint 1099998 个</button>
            </div>

            <hr/>
            <div className='section-container'>
                <span className='section-title'> mint 测试 USDT 币 </span>
                <div className='section-address'> USDT 币地址: { USDT_ContractAddress }</div>
                <div className='section-balance'> balance of USDT: { mockUSDT_Balance }</div>
                <button className='section-button' onClick={ () => usdt_ButtonClick(1099998) }> mint 1099998 个 </button>
            </div>
        </>
	);
}

export default MintUSDC;