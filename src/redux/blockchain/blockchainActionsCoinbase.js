// constants
import Web3EthContract from "web3-eth-contract";
import WalletLink from 'walletlink';
import Web3 from "web3";
// log
import { fetchData } from "../data/dataActions";

const connectRequest = () => {
  return {
    type: "CONNECTION_REQUEST",
  };
};

const connectSuccess = (payload) => {
  return {
    type: "CONNECTION_SUCCESS",
    payload: payload,
  };
};

const connectFailed = (payload) => {
  return {
    type: "CONNECTION_FAILED",
    payload: payload,
  };
};

const updateAccountRequest = (payload) => {
  return {
    type: "UPDATE_ACCOUNT",
    payload: payload,
  };
};

export const connectcoinbase = () => {
  return async (dispatch) => {
    dispatch(connectRequest());
    
    const abiResponse = await fetch("/config/abi.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const abi = await abiResponse.json();
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const CONFIG = await configResponse.json();
    // const { ethereum } = window;
    // const metamaskIsInstalled = ethereum && ethereum.isMetaMask;

    const APP_NAME = 'Vektorcoinbase';
    const APP_LOGO_URL = 'http://localhost:3000/config/images/coinbase.png';
    const ETH_JSONRPC_URL = 'https://mainnet.infura.io/v3/de98845889164596b64d51908b361ce2';
    const CHAIN_ID = CONFIG.NETWORK.ID;

    const walletLink = new WalletLink({
      appName: APP_NAME,
      appLogoUrl: APP_LOGO_URL,
      darkMode: false
    });

    // Initialize a Web3 Provider object
    const ethereum = walletLink.makeWeb3Provider(ETH_JSONRPC_URL, CHAIN_ID); 
    Web3EthContract.setProvider(ethereum);
    let web3 = new Web3(ethereum);        
    // console.log(ethereum);
    
    try {
        ethereum.send('eth_requestAccounts').then((accounts) => {
          // console.log(`User's address is ${accounts[0]}`);      
          // web3.eth.defaultAccount = accounts[0];

          const SmartContractObj = new Web3EthContract(
            abi,
            CONFIG.CONTRACT_ADDRESS
          );
          dispatch(
            connectSuccess({
              account: accounts[0],
              smartContract: SmartContractObj,
              web3: web3,
            })
          );
          
          // Add listeners start
          ethereum.on("accountsChanged", (accounts) => {
            dispatch(updateAccount(accounts[0]));
          });
          ethereum.on("chainChanged", () => {
            window.location.reload();
          });
        });
    } catch (err) {
      dispatch(connectFailed("Something went wrong."));
    }
   
  };
};

export const updateAccount = (account) => {
  return async (dispatch) => {
    dispatch(updateAccountRequest({ account: account }));
    dispatch(fetchData(account));
  };
};

