
import React, { useState } from 'react';
import { ethers } from 'ethers';
import './WalletCard.css'
import MintUSDC from './MintUSDC';

const WalletCard = () => {

    const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState(null);
	const [userBalance, setUserBalance] = useState(null);
	const [connButtonText] = useState('Connect Wallet');

    const connectWalletHandler = () => {
        if (window.ethereum) {
            // metamask is here I think
            window.ethereum.request({method: 'eth_requestAccounts'})
            .then( result => {
                accountChangeHandler(result[0]);
            });
        } else {
            setErrorMessage("Install MetaMask");
        }
    };

    const accountChangeHandler = (newAccount) => {
        setDefaultAccount(newAccount);
        getUserBalance(newAccount.toString());
    };

    const getUserBalance = (address) => {
        window.ethereum.request({method: 'eth_getBalance', params: [address, 'latest']})
        .then(balance => {
            setUserBalance(ethers.utils.formatEther(balance));
        });
    };

    const chainChanged = () => {
        window.location.reload();
    };

    window.ethereum.on('accountsChanged', accountChangeHandler);
    window.ethereum.on('chainChanged', chainChanged);

    return (
		<div className='walletCard'>
		<h4 className='wallet-topic'> {"Connection to MetaMask"} </h4>
			<button className='wallet-button' onClick={connectWalletHandler}>{connButtonText}</button>
			<div className='accountDisplay'>
				<h3>Address: {defaultAccount}</h3>
			</div>
			<div className='balanceDisplay'>
				<h3>Balance of ETH: {userBalance}</h3>
			</div>
			{errorMessage}
		
        <MintUSDC accountInfo={defaultAccount} />
        </div>
	);
}

export default WalletCard;