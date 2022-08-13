import React, { useEffect, useState, useRef } from "react";
import ReactPlayer from "react-player";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { connectcoinbase } from "./redux/blockchain/blockchainActionsCoinbase";
import { connectwalletcon } from "./redux/blockchain/blockchainActionsWallet";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import Timer from "./Countdown/Timer";
import ReactDOM from "react-dom";
import Faq from "react-faq-component";
// import $ from 'jquery';

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: var(--secondary);
  padding: 10px;
  font-weight: bold;
  color: var(--secondary-text);
  width: 100px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    width: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px dashed var(--secondary);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [mintAmount1, setMintAmount1] = useState(1);
  const [mintAmount2, setMintAmount2] = useState(1);
  const [mintAmount3, setMintAmount3] = useState(1);
  const [mintAmount4, setMintAmount4] = useState(1);
  const [totalCostamount1, setTotalAmount1] = useState(0.88);
  const [totalCostamount2, setTotalAmount2] = useState(0.44);
  const [totalCostamount3, setTotalAmount3] = useState(0.18);
  const [totalCostamount4, setTotalAmount4] = useState(0.088);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "0x4a4a22f524343625f0ca407943dc7bd1fec08f03",
    SCAN_LINK:
      "https://rinkeby.etherscan.io/address/0x4a4a22f524343625f0ca407943dc7bd1fec08f03",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY1: 1,
    WEI_COST1: 0,
    DISPLAY_COST1: 0,
    MAX_SUPPLY2: 1,
    WEI_COST2: 0,
    DISPLAY_COST2: 0,
    MAX_SUPPLY3: 1,
    WEI_COST3: 0,
    DISPLAY_COST3: 0,
    MAX_SUPPLY4: 1,
    WEI_COST4: 0,
    DISPLAY_COST4: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  // Platinum
  const claimNFTs1 = () => {
    let cost = CONFIG.WEI_COST1;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount1);
    let totalGasLimit = String(gasLimit * mintAmount1);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .PlatinumMint(blockchain.account, mintAmount1)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount1 = () => {
    let newMintAmount1 = mintAmount1 - 1;
    if (newMintAmount1 < 1) {
      newMintAmount1 = 1;
    }
    setMintAmount1(newMintAmount1);
    let cost = CONFIG.WEI_COST1;
    let totalCostamount1 = String(
      (cost * newMintAmount1) / 1000000000000000000
    );
    setTotalAmount1(totalCostamount1);
  };
  const incrementMintAmount1 = () => {
    let newMintAmount1 = mintAmount1 + 1;
    if (newMintAmount1 > 3) {
      newMintAmount1 = 3;
    }
    setMintAmount1(newMintAmount1);
    let cost = CONFIG.WEI_COST1;
    let totalCostamount1 = String(
      (cost * newMintAmount1) / 1000000000000000000
    );
    setTotalAmount1(totalCostamount1);
  };

  // Gold
  const claimNFTs2 = () => {
    let cost = CONFIG.WEI_COST2;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount2);
    let totalGasLimit = String(gasLimit * mintAmount2);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .GoldMint(blockchain.account, mintAmount2)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount2 = () => {
    let newMintAmount2 = mintAmount2 - 1;
    if (newMintAmount2 < 1) {
      newMintAmount2 = 1;
    }
    setMintAmount2(newMintAmount2);
    let cost = CONFIG.WEI_COST2;
    let totalCostamount2 = String(
      (cost * newMintAmount2) / 1000000000000000000
    );
    setTotalAmount2(totalCostamount2);
  };
  const incrementMintAmount2 = () => {
    let newMintAmount2 = mintAmount2 + 1;
    if (newMintAmount2 > 3) {
      newMintAmount2 = 3;
    }
    setMintAmount2(newMintAmount2);
    let cost = CONFIG.WEI_COST2;
    let totalCostamount2 = String(
      (cost * newMintAmount2) / 1000000000000000000
    );
    setTotalAmount2(totalCostamount2);
  };

  // Silver
  const claimNFTs3 = () => {
    let cost = CONFIG.WEI_COST3;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount3);
    let totalGasLimit = String(gasLimit * mintAmount3);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .SilverMint(blockchain.account, mintAmount3)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount3 = () => {
    let newMintAmount3 = mintAmount3 - 1;
    if (newMintAmount3 < 1) {
      newMintAmount3 = 1;
    }
    setMintAmount3(newMintAmount3);
    let cost = CONFIG.WEI_COST3;
    let totalCostamount3 = String(
      (cost * newMintAmount3) / 1000000000000000000
    );
    setTotalAmount3(totalCostamount3);
  };
  const incrementMintAmount3 = () => {
    let newMintAmount3 = mintAmount3 + 1;
    if (newMintAmount3 > 3) {
      newMintAmount3 = 3;
    }
    setMintAmount3(newMintAmount3);
    let cost = CONFIG.WEI_COST3;
    let totalCostamount3 = String(
      (cost * newMintAmount3) / 1000000000000000000
    );
    setTotalAmount3(totalCostamount3);
  };

  // Bronze
  const claimNFTs4 = () => {
    let cost = CONFIG.WEI_COST4;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount4);
    let totalGasLimit = String(gasLimit * mintAmount4);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .BronzeMint(blockchain.account, mintAmount4)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount4 = () => {
    let newMintAmount4 = mintAmount4 - 1;
    if (newMintAmount4 < 1) {
      newMintAmount4 = 1;
    }
    setMintAmount4(newMintAmount4);
    let cost = CONFIG.WEI_COST4;
    let totalCostamount4 = String(
      (cost * newMintAmount4) / 1000000000000000000
    );
    setTotalAmount4(totalCostamount4);
  };
  const incrementMintAmount4 = () => {
    let newMintAmount4 = mintAmount4 + 1;
    if (newMintAmount4 > 3) {
      newMintAmount4 = 3;
    }
    setMintAmount4(newMintAmount4);
    let cost = CONFIG.WEI_COST4;
    let totalCostamount4 = String(
      (cost * newMintAmount4) / 1000000000000000000
    );
    setTotalAmount4(totalCostamount4);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
      blockchain.smartContract.methods
        .getPrice(4, blockchain.account)
        .call((err, res) => {
          setTotalAmount1(res / 1000000000000000000);
        });
      blockchain.smartContract.methods
        .getPrice(3, blockchain.account)
        .call((err, res) => {
          setTotalAmount2(res / 1000000000000000000);
        });
      blockchain.smartContract.methods
        .getPrice(2, blockchain.account)
        .call((err, res) => {
          setTotalAmount3(res / 1000000000000000000);
        });
      blockchain.smartContract.methods
        .getPrice(1, blockchain.account)
        .call((err, res) => {
          setTotalAmount4(res / 1000000000000000000);
        });

      SET_CONFIG({
        ...CONFIG,
        WEI_COST1: totalCostamount1 * 1000000000000000000,
        WEI_COST2: totalCostamount2 * 1000000000000000000,
        WEI_COST3: totalCostamount3 * 1000000000000000000,
        WEI_COST4: totalCostamount4 * 1000000000000000000,
        DISPLAY_COST1: totalCostamount1,
        DISPLAY_COST2: totalCostamount2,
        DISPLAY_COST3: totalCostamount3,
        DISPLAY_COST4: totalCostamount4,
      });
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <s.Screen>
      <s.Container jc={"center"} ai={"center"} className="headermenu">
        <s.Container
          jc={"center"}
          ai={"center"}
          style={{ display: "inline-block" }}
        >
          <img
            alt="logo"
            src={"/config/images/logo.png"}
            className="headerlogo"
          />
          {/* <s.Container jc={"center"} ai={"center"} className="headermenusubdiv">
                <a href="#about">Programs</a>
                <a href="#roadmap">Tuition</a>                        
                <a href="#faq">Class</a>
                <a href="#ourteam">Scheduel</a>	      
                <a href="#ourteam">Why NFT Clinic</a>	      
                <a href="#ourteam">About</a>	
                <a href="#" target="_black" style={{ marginLeft: "15% !important"}} ><StyledImg alt={"opensea"} src={"/config/images/opensea.svg"} style={{ border: "none", borderRadius: 0, maxWidth: 38, background: "none"}} /></a>
                <a href="#" target="_black" ><StyledImg alt={"discord"} src={"/config/images/discord.svg"} style={{ border: "none", borderRadius: 0, maxWidth: 38, background: "none"}} /></a>
                <a href="#" target="_black" ><StyledImg alt={"twitter"} src={"/config/images/twitter.svg"} style={{ border: "none", borderRadius: 0, maxWidth: 38, background: "none"}} /></a>
            </s.Container> */}
        </s.Container>
      </s.Container>
      <s.Container jc={"center"} ai={"center"}>
        <StyledImg
          alt={"example"}
          src={"/config/images/topbanner.jpg"}
          style={{ border: "none", borderRadius: 0, width: "100%" }}
        />
      </s.Container>
      <s.Container
        jc={"center"}
        ai={"center"}
        id="about"
        style={{ position: "absolute", top: 200 }}
      >
        <ResponsiveWrapper
          flex={1}
          style={{
            padding: 24,
            maxWidth: 1250,
            marginTop: 50,
            marginBottom: 20,
          }}
          test
        >
          <s.Container flex={1} jc={"center"} ai={"center"}>
            <s.TextTitle
              className="mobile-headertext"
              style={{
                textAlign: "left",
                fontFamily: "Poppins-Bold",
                fontSize: 48,
                color: "var(--primary-text)",
                marginBottom: 30,
              }}
            >
              The First Decentralized Academy for NFT Creators
            </s.TextTitle>
            <s.TextDescription className="mintitems-desc">
              NFT Clinic is the most prestigious and recognized academy for NFT
              Creators. Our Certification process to our students covers all
              known aspects of Non-Fungible Assets existing in the Blockchain
              environment today. Investors, Brands, Influencers and Celebrities
              depend on our expertise and training to assure them a safe,
              profitable, and secure involvement prior to working with an NFT.
              Validating and understanding your skills through our exam-based
              certification process will provide insights into the workings of
              Ethereum and the Non-Fungible Tokens.
            </s.TextDescription>
          </s.Container>
          <s.Container
            flex={1}
            jc={"center"}
            ai={"center"}
            style={{ display: "initial" }}
          ></s.Container>
        </ResponsiveWrapper>
      </s.Container>

      <s.Container jc={"center"} ai={"center"}>
        <ResponsiveWrapper
          flex={1}
          style={{ padding: 24, maxWidth: 1450, display: "none" }}
          test
        >
          <Timer />
        </ResponsiveWrapper>
      </s.Container>

      <s.Container jc={"center"} ai={"center"} id="mintsection">
        <ResponsiveWrapper
          flex={1}
          style={{
            padding: 24,
            maxWidth: 1250,
            marginTop: 50,
            marginBottom: 20,
            fontFamily: "Poppins-Bold",
          }}
          test
        >
          <s.Container flex={1} jc={"center"} ai={"center"}>
            <s.Container flex={1} jc={"center"} ai={"center"}>
              <StyledImg
                alt={"Mintimg1"}
                src={"/config/images/Platinum.gif"}
                className="mintsectionimg"
              />
              <s.TextDescription style={{ textAlign: "center", fontSize: 23 }}>
                Pick 12 Classes
              </s.TextDescription>
              <s.TextDescription style={{ textAlign: "center", fontSize: 18 }}>
                {data.totalPlatinumSupply}
              </s.TextDescription>
              <s.SpacerSmall />
              {Number(data.totalPlatinumSupply) >= CONFIG.MAX_SUPPLY1 ? (
                <>
                  <s.TextTitle style={{ textAlign: "center" }}>
                    The sale has ended.
                  </s.TextTitle>
                  <s.TextDescription style={{ textAlign: "center" }}>
                    You can still find {CONFIG.NFT_NAME} on
                  </s.TextDescription>
                  <s.SpacerSmall />
                  <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                    {CONFIG.MARKETPLACE}
                  </StyledLink>
                </>
              ) : (
                <>
                  <s.Container
                    flex={1}
                    jc={"center"}
                    ai={"center"}
                    style={{ textAlign: "center", display: "block", flex: 0 }}
                  >
                    <s.TextTitle
                      style={{
                        textAlign: "center",
                        fontSize: 48,
                        display: "inline-block",
                        verticalAlign: "super",
                      }}
                    >
                      {/* 1 {CONFIG.SYMBOL} costs {CONFIG.DISPLAY_COST}{" "}
                                {CONFIG.NETWORK.SYMBOL}. */}
                      <StyledImg
                        alt={"Ethlogo"}
                        src={"/config/images/EthereumLogo.svg"}
                        className="ethlogoimage"
                      />
                      {CONFIG.DISPLAY_COST1}{" "}
                      <font style={{ fontSize: 23 }}>ETH</font>
                    </s.TextTitle>
                    {/* <s.SpacerXSmall /> */}
                    <s.TextDescription
                      style={{ textAlign: "center", display: "none" }}
                    >
                      Excluding gas fees.
                    </s.TextDescription>
                  </s.Container>
                  {/* <s.SpacerSmall /> */}
                  {blockchain.account === "" ||
                  blockchain.smartContract === null ? (
                    <s.Container
                      ai={"center"}
                      jc={"center"}
                      style={{ display: "block", textAlign: "center" }}
                    >
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                        }}
                      >
                        Connect to the {CONFIG.NETWORK.NAME} network
                      </s.TextDescription>
                      <s.SpacerSmall />
                      {/* <StyledButton
                                    className="mintbtn"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      dispatch(connect());
                                      getData();
                                    }}
                                  >
                                    Connect
                                  </StyledButton> */}
                      <StyledButton
                        className="mintbtn walletbtncon"
                        onClick={(e) => {
                          e.preventDefault();
                          dispatch(connect());
                          getData();
                        }}
                      >
                        {/* <StyledImg
                                      alt={"coinbase"}
                                      className="walletconbtn"
                                      src={"/config/images/metamask.png"}
                                      style={{ border: "none", borderRadius: 0, width: "100%" }}
                                    /> */}
                        Connect
                      </StyledButton>
                      {/* <StyledButton
                                    className="mintbtn walletbtncon"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      dispatch(connectcoinbase());
                                      getData();
                                    }}
                                  >
                                    <StyledImg
                                      alt={"coinbase"}
                                      className="walletconbtn"
                                      src={"/config/images/coinbase.png"}
                                      style={{ border: "none", borderRadius: 0, width: "100%" }}
                                    />
                                    Coinbase
                                  </StyledButton>
                                  <StyledButton
                                    className="mintbtn walletbtncon"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      dispatch(connectwalletcon());
                                      getData();
                                    }}
                                  >
                                    <StyledImg
                                      alt={"coinbase"}
                                      className="walletconbtn"
                                      src={"/config/images/walletconnect.png"}
                                      style={{ border: "none", borderRadius: 0, width: "100%" }}
                                    />
                                    WalletConnect
                                  </StyledButton> */}
                      {blockchain.errorMsg !== "" ? (
                        <>
                          <s.SpacerSmall />
                          <s.TextDescription
                            style={{
                              textAlign: "center",
                            }}
                          >
                            {blockchain.errorMsg}
                          </s.TextDescription>
                        </>
                      ) : null}
                    </s.Container>
                  ) : (
                    <>
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                        }}
                      >
                        {feedback}
                      </s.TextDescription>
                      <s.SpacerMedium />
                      <s.Container ai={"center"} jc={"center"} fd={"row"}>
                        <StyledRoundButton
                          className="mintnumberbtn"
                          disabled={claimingNft ? 1 : 0}
                          onClick={(e) => {
                            e.preventDefault();
                            decrementMintAmount1();
                          }}
                        >
                          -
                        </StyledRoundButton>
                        <s.SpacerMedium />
                        <s.SpacerMedium />
                        <s.TextDescription
                          style={{ textAlign: "center", fontSize: 45 }}
                        >
                          {mintAmount1}
                        </s.TextDescription>
                        <s.SpacerMedium />
                        <s.SpacerMedium />
                        <StyledRoundButton
                          className="mintnumberbtn"
                          disabled={claimingNft ? 1 : 0}
                          onClick={(e) => {
                            e.preventDefault();
                            incrementMintAmount1();
                          }}
                        >
                          +
                        </StyledRoundButton>
                      </s.Container>
                      <s.SpacerSmall />

                      <s.Container
                        ai={"center"}
                        jc={"center"}
                        fd={"row"}
                        style={{ marginTop: 25 }}
                      >
                        <StyledButton
                          disabled={claimingNft ? 1 : 0}
                          className="mintbtn"
                          onClick={(e) => {
                            e.preventDefault();
                            claimNFTs1();
                            getData();
                          }}
                        >
                          {claimingNft
                            ? "BUSY"
                            : "MINT for " + totalCostamount1 + " ETH"}
                        </StyledButton>
                      </s.Container>
                    </>
                  )}
                </>
              )}
              <s.SpacerMedium />
            </s.Container>
          </s.Container>
          <s.Container flex={1} jc={"center"} ai={"center"}>
            <s.Container flex={1} jc={"center"} ai={"center"}>
              <StyledImg
                alt={"Mintimg1"}
                src={"/config/images/Gold.gif"}
                className="mintsectionimg"
              />
              <s.TextDescription style={{ textAlign: "center", fontSize: 21 }}>
                Pick 9 Classes
              </s.TextDescription>
              <s.SpacerSmall />
              {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY2 ? (
                <>
                  <s.TextTitle style={{ textAlign: "center" }}>
                    The sale has ended.
                  </s.TextTitle>
                  <s.TextDescription style={{ textAlign: "center" }}>
                    You can still find {CONFIG.NFT_NAME} on
                  </s.TextDescription>
                  <s.SpacerSmall />
                  <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                    {CONFIG.MARKETPLACE}
                  </StyledLink>
                </>
              ) : (
                <>
                  <s.Container
                    flex={1}
                    jc={"center"}
                    ai={"center"}
                    style={{ textAlign: "center", display: "block", flex: 0 }}
                  >
                    <s.TextTitle
                      style={{
                        textAlign: "center",
                        fontSize: 48,
                        display: "inline-block",
                        verticalAlign: "super",
                      }}
                    >
                      {/* 1 {CONFIG.SYMBOL} costs {CONFIG.DISPLAY_COST}{" "}
                                {CONFIG.NETWORK.SYMBOL}. */}
                      <StyledImg
                        alt={"Ethlogo"}
                        src={"/config/images/EthereumLogo.svg"}
                        className="ethlogoimage"
                      />
                      {CONFIG.DISPLAY_COST2}{" "}
                      <font style={{ fontSize: 23 }}>ETH</font>
                    </s.TextTitle>
                    {/* <s.SpacerXSmall /> */}
                    <s.TextDescription
                      style={{ textAlign: "center", display: "none" }}
                    >
                      Excluding gas fees.
                    </s.TextDescription>
                  </s.Container>
                  {/* <s.SpacerSmall /> */}
                  {blockchain.account === "" ||
                  blockchain.smartContract === null ? (
                    <s.Container
                      ai={"center"}
                      jc={"center"}
                      style={{ display: "block", textAlign: "center" }}
                    >
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                        }}
                      >
                        Connect to the {CONFIG.NETWORK.NAME} network
                      </s.TextDescription>
                      <s.SpacerSmall />
                      {/* <StyledButton
                                    className="mintbtn"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      dispatch(connect());
                                      getData();
                                    }}
                                  >
                                    Connect
                                  </StyledButton> */}
                      <StyledButton
                        className="mintbtn walletbtncon"
                        onClick={(e) => {
                          e.preventDefault();
                          dispatch(connect());
                          getData();
                        }}
                      >
                        {/* <StyledImg
                                      alt={"coinbase"}
                                      className="walletconbtn"
                                      src={"/config/images/metamask.png"}
                                      style={{ border: "none", borderRadius: 0, width: "100%" }}
                                    /> */}
                        Connect
                      </StyledButton>
                      {/* <StyledButton
                                    className="mintbtn walletbtncon"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      dispatch(connectcoinbase());
                                      getData();
                                    }}
                                  >
                                    <StyledImg
                                      alt={"coinbase"}
                                      className="walletconbtn"
                                      src={"/config/images/coinbase.png"}
                                      style={{ border: "none", borderRadius: 0, width: "100%" }}
                                    />
                                    Coinbase
                                  </StyledButton>
                                  <StyledButton
                                    className="mintbtn walletbtncon"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      dispatch(connectwalletcon());
                                      getData();
                                    }}
                                  >
                                    <StyledImg
                                      alt={"coinbase"}
                                      className="walletconbtn"
                                      src={"/config/images/walletconnect.png"}
                                      style={{ border: "none", borderRadius: 0, width: "100%" }}
                                    />
                                    WalletConnect
                                  </StyledButton> */}
                      {blockchain.errorMsg !== "" ? (
                        <>
                          <s.SpacerSmall />
                          <s.TextDescription
                            style={{
                              textAlign: "center",
                            }}
                          >
                            {blockchain.errorMsg}
                          </s.TextDescription>
                        </>
                      ) : null}
                    </s.Container>
                  ) : (
                    <>
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                        }}
                      >
                        {feedback}
                      </s.TextDescription>
                      <s.SpacerMedium />
                      <s.Container ai={"center"} jc={"center"} fd={"row"}>
                        <StyledRoundButton
                          className="mintnumberbtn"
                          disabled={claimingNft ? 1 : 0}
                          onClick={(e) => {
                            e.preventDefault();
                            decrementMintAmount2();
                          }}
                        >
                          -
                        </StyledRoundButton>
                        <s.SpacerMedium />
                        <s.SpacerMedium />
                        <s.TextDescription
                          style={{ textAlign: "center", fontSize: 45 }}
                        >
                          {mintAmount2}
                        </s.TextDescription>
                        <s.SpacerMedium />
                        <s.SpacerMedium />
                        <StyledRoundButton
                          className="mintnumberbtn"
                          disabled={claimingNft ? 1 : 0}
                          onClick={(e) => {
                            e.preventDefault();
                            incrementMintAmount2();
                          }}
                        >
                          +
                        </StyledRoundButton>
                      </s.Container>
                      <s.SpacerSmall />

                      <s.Container
                        ai={"center"}
                        jc={"center"}
                        fd={"row"}
                        style={{ marginTop: 25 }}
                      >
                        <StyledButton
                          disabled={claimingNft ? 1 : 0}
                          className="mintbtn"
                          onClick={(e) => {
                            e.preventDefault();
                            claimNFTs2();
                            getData();
                          }}
                        >
                          {claimingNft
                            ? "BUSY"
                            : "MINT for " + totalCostamount2 + " ETH"}
                        </StyledButton>
                      </s.Container>
                    </>
                  )}
                </>
              )}
              <s.SpacerMedium />
            </s.Container>
          </s.Container>
        </ResponsiveWrapper>
      </s.Container>

      <s.Container jc={"center"} ai={"center"} id="mintsection">
        <ResponsiveWrapper
          flex={1}
          style={{
            padding: 24,
            maxWidth: 1250,
            marginTop: 50,
            marginBottom: 20,
            fontFamily: "Poppins-Bold",
          }}
          test
        >
          <s.Container flex={1} jc={"center"} ai={"center"}>
            <s.Container flex={1} jc={"center"} ai={"center"}>
              <StyledImg
                alt={"Mintimg1"}
                src={"/config/images/Silver.gif"}
                className="mintsectionimg"
              />
              <s.TextDescription style={{ textAlign: "center", fontSize: 21 }}>
                Pick 6 Classes
              </s.TextDescription>
              <s.SpacerSmall />
              {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY3 ? (
                <>
                  <s.TextTitle style={{ textAlign: "center" }}>
                    The sale has ended.
                  </s.TextTitle>
                  <s.TextDescription style={{ textAlign: "center" }}>
                    You can still find {CONFIG.NFT_NAME} on
                  </s.TextDescription>
                  <s.SpacerSmall />
                  <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                    {CONFIG.MARKETPLACE}
                  </StyledLink>
                </>
              ) : (
                <>
                  <s.Container
                    flex={1}
                    jc={"center"}
                    ai={"center"}
                    style={{ textAlign: "center", display: "block", flex: 0 }}
                  >
                    <s.TextTitle
                      style={{
                        textAlign: "center",
                        fontSize: 48,
                        display: "inline-block",
                        verticalAlign: "super",
                      }}
                    >
                      {/* 1 {CONFIG.SYMBOL} costs {CONFIG.DISPLAY_COST}{" "}
                                {CONFIG.NETWORK.SYMBOL}. */}
                      <StyledImg
                        alt={"Ethlogo"}
                        src={"/config/images/EthereumLogo.svg"}
                        className="ethlogoimage"
                      />
                      {CONFIG.DISPLAY_COST3}{" "}
                      <font style={{ fontSize: 23 }}>ETH</font>
                    </s.TextTitle>
                    {/* <s.SpacerXSmall /> */}
                    <s.TextDescription
                      style={{ textAlign: "center", display: "none" }}
                    >
                      Excluding gas fees.
                    </s.TextDescription>
                  </s.Container>
                  {/* <s.SpacerSmall /> */}
                  {blockchain.account === "" ||
                  blockchain.smartContract === null ? (
                    <s.Container
                      ai={"center"}
                      jc={"center"}
                      style={{ display: "block", textAlign: "center" }}
                    >
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                        }}
                      >
                        Connect to the {CONFIG.NETWORK.NAME} network
                      </s.TextDescription>
                      <s.SpacerSmall />
                      {/* <StyledButton
                                    className="mintbtn"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      dispatch(connect());
                                      getData();
                                    }}
                                  >
                                    Connect
                                  </StyledButton> */}
                      <StyledButton
                        className="mintbtn walletbtncon"
                        onClick={(e) => {
                          e.preventDefault();
                          dispatch(connect());
                          getData();
                        }}
                      >
                        {/* <StyledImg
                                      alt={"coinbase"}
                                      className="walletconbtn"
                                      src={"/config/images/metamask.png"}
                                      style={{ border: "none", borderRadius: 0, width: "100%" }}
                                    /> */}
                        Connect
                      </StyledButton>
                      {/* <StyledButton
                                    className="mintbtn walletbtncon"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      dispatch(connectcoinbase());
                                      getData();
                                    }}
                                  >
                                    <StyledImg
                                      alt={"coinbase"}
                                      className="walletconbtn"
                                      src={"/config/images/coinbase.png"}
                                      style={{ border: "none", borderRadius: 0, width: "100%" }}
                                    />
                                    Coinbase
                                  </StyledButton>
                                  <StyledButton
                                    className="mintbtn walletbtncon"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      dispatch(connectwalletcon());
                                      getData();
                                    }}
                                  >
                                    <StyledImg
                                      alt={"coinbase"}
                                      className="walletconbtn"
                                      src={"/config/images/walletconnect.png"}
                                      style={{ border: "none", borderRadius: 0, width: "100%" }}
                                    />
                                    WalletConnect
                                  </StyledButton> */}
                      {blockchain.errorMsg !== "" ? (
                        <>
                          <s.SpacerSmall />
                          <s.TextDescription
                            style={{
                              textAlign: "center",
                            }}
                          >
                            {blockchain.errorMsg}
                          </s.TextDescription>
                        </>
                      ) : null}
                    </s.Container>
                  ) : (
                    <>
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                        }}
                      >
                        {feedback}
                      </s.TextDescription>
                      <s.SpacerMedium />
                      <s.Container ai={"center"} jc={"center"} fd={"row"}>
                        <StyledRoundButton
                          className="mintnumberbtn"
                          disabled={claimingNft ? 1 : 0}
                          onClick={(e) => {
                            e.preventDefault();
                            decrementMintAmount3();
                          }}
                        >
                          -
                        </StyledRoundButton>
                        <s.SpacerMedium />
                        <s.SpacerMedium />
                        <s.TextDescription
                          style={{ textAlign: "center", fontSize: 45 }}
                        >
                          {mintAmount3}
                        </s.TextDescription>
                        <s.SpacerMedium />
                        <s.SpacerMedium />
                        <StyledRoundButton
                          className="mintnumberbtn"
                          disabled={claimingNft ? 1 : 0}
                          onClick={(e) => {
                            e.preventDefault();
                            incrementMintAmount3();
                          }}
                        >
                          +
                        </StyledRoundButton>
                      </s.Container>
                      <s.SpacerSmall />

                      <s.Container
                        ai={"center"}
                        jc={"center"}
                        fd={"row"}
                        style={{ marginTop: 25 }}
                      >
                        <StyledButton
                          disabled={claimingNft ? 1 : 0}
                          className="mintbtn"
                          onClick={(e) => {
                            e.preventDefault();
                            claimNFTs3();
                            getData();
                          }}
                        >
                          {claimingNft
                            ? "BUSY"
                            : "MINT for " + totalCostamount3 + " ETH"}
                        </StyledButton>
                      </s.Container>
                    </>
                  )}
                </>
              )}
              <s.SpacerMedium />
            </s.Container>
          </s.Container>
          <s.Container flex={1} jc={"center"} ai={"center"}>
            <s.Container flex={1} jc={"center"} ai={"center"}>
              <StyledImg
                alt={"Mintimg1"}
                src={"/config/images/Bronze.gif"}
                className="mintsectionimg"
              />
              <s.TextDescription style={{ textAlign: "center", fontSize: 21 }}>
                Pick 3 Classes
              </s.TextDescription>
              <s.SpacerSmall />
              {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY4 ? (
                <>
                  <s.TextTitle style={{ textAlign: "center" }}>
                    The sale has ended.
                  </s.TextTitle>
                  <s.TextDescription style={{ textAlign: "center" }}>
                    You can still find {CONFIG.NFT_NAME} on
                  </s.TextDescription>
                  <s.SpacerSmall />
                  <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                    {CONFIG.MARKETPLACE}
                  </StyledLink>
                </>
              ) : (
                <>
                  <s.Container
                    flex={1}
                    jc={"center"}
                    ai={"center"}
                    style={{ textAlign: "center", display: "block", flex: 0 }}
                  >
                    <s.TextTitle
                      style={{
                        textAlign: "center",
                        fontSize: 48,
                        display: "inline-block",
                        verticalAlign: "super",
                      }}
                    >
                      {/* 1 {CONFIG.SYMBOL} costs {CONFIG.DISPLAY_COST}{" "}
                                {CONFIG.NETWORK.SYMBOL}. */}
                      <StyledImg
                        alt={"Ethlogo"}
                        src={"/config/images/EthereumLogo.svg"}
                        className="ethlogoimage"
                      />
                      {CONFIG.DISPLAY_COST4}{" "}
                      <font style={{ fontSize: 23 }}>ETH</font>
                    </s.TextTitle>
                    {/* <s.SpacerXSmall /> */}
                    <s.TextDescription
                      style={{ textAlign: "center", display: "none" }}
                    >
                      Excluding gas fees.
                    </s.TextDescription>
                  </s.Container>
                  {/* <s.SpacerSmall /> */}
                  {blockchain.account === "" ||
                  blockchain.smartContract === null ? (
                    <s.Container
                      ai={"center"}
                      jc={"center"}
                      style={{ display: "block", textAlign: "center" }}
                    >
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                        }}
                      >
                        Connect to the {CONFIG.NETWORK.NAME} network
                      </s.TextDescription>
                      <s.SpacerSmall />
                      {/* <StyledButton
                                    className="mintbtn"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      dispatch(connect());
                                      getData();
                                    }}
                                  >
                                    Connect
                                  </StyledButton> */}
                      <StyledButton
                        className="mintbtn walletbtncon"
                        onClick={(e) => {
                          e.preventDefault();
                          dispatch(connect());
                          getData();
                        }}
                      >
                        {/* <StyledImg
                                      alt={"coinbase"}
                                      className="walletconbtn"
                                      src={"/config/images/metamask.png"}
                                      style={{ border: "none", borderRadius: 0, width: "100%" }}
                                    /> */}
                        Connect
                      </StyledButton>
                      {/* <StyledButton
                                    className="mintbtn walletbtncon"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      dispatch(connectcoinbase());
                                      getData();
                                    }}
                                  >
                                    <StyledImg
                                      alt={"coinbase"}
                                      className="walletconbtn"
                                      src={"/config/images/coinbase.png"}
                                      style={{ border: "none", borderRadius: 0, width: "100%" }}
                                    />
                                    Coinbase
                                  </StyledButton>
                                  <StyledButton
                                    className="mintbtn walletbtncon"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      dispatch(connectwalletcon());
                                      getData();
                                    }}
                                  >
                                    <StyledImg
                                      alt={"coinbase"}
                                      className="walletconbtn"
                                      src={"/config/images/walletconnect.png"}
                                      style={{ border: "none", borderRadius: 0, width: "100%" }}
                                    />
                                    WalletConnect
                                  </StyledButton> */}
                      {blockchain.errorMsg !== "" ? (
                        <>
                          <s.SpacerSmall />
                          <s.TextDescription
                            style={{
                              textAlign: "center",
                            }}
                          >
                            {blockchain.errorMsg}
                          </s.TextDescription>
                        </>
                      ) : null}
                    </s.Container>
                  ) : (
                    <>
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                        }}
                      >
                        {feedback}
                      </s.TextDescription>
                      <s.SpacerMedium />
                      <s.Container ai={"center"} jc={"center"} fd={"row"}>
                        <StyledRoundButton
                          className="mintnumberbtn"
                          disabled={claimingNft ? 1 : 0}
                          onClick={(e) => {
                            e.preventDefault();
                            decrementMintAmount4();
                          }}
                        >
                          -
                        </StyledRoundButton>
                        <s.SpacerMedium />
                        <s.SpacerMedium />
                        <s.TextDescription
                          style={{ textAlign: "center", fontSize: 45 }}
                        >
                          {mintAmount4}
                        </s.TextDescription>
                        <s.SpacerMedium />
                        <s.SpacerMedium />
                        <StyledRoundButton
                          className="mintnumberbtn"
                          disabled={claimingNft ? 1 : 0}
                          onClick={(e) => {
                            e.preventDefault();
                            incrementMintAmount4();
                          }}
                        >
                          +
                        </StyledRoundButton>
                      </s.Container>
                      <s.SpacerSmall />

                      <s.Container
                        ai={"center"}
                        jc={"center"}
                        fd={"row"}
                        style={{ marginTop: 25 }}
                      >
                        <StyledButton
                          disabled={claimingNft ? 1 : 0}
                          className="mintbtn"
                          onClick={(e) => {
                            e.preventDefault();
                            claimNFTs4();
                            getData();
                          }}
                        >
                          {claimingNft
                            ? "BUSY"
                            : "MINT for " + totalCostamount4 + " ETH"}
                        </StyledButton>
                      </s.Container>
                    </>
                  )}
                </>
              )}
              <s.SpacerMedium />
            </s.Container>
          </s.Container>
        </ResponsiveWrapper>
      </s.Container>

      <s.Container
        flex={1}
        ai={"center"}
        style={{ backgroundColor: "var(--primary)" }}
      >
        <s.Container jc={"center"} ai={"center"} className="footersection">
          <ResponsiveWrapper
            flex={1}
            style={{ padding: "0px 5%", maxWidth: 1450 }}
            test
          >
            <s.Container
              flex={1}
              jc={"center"}
              ai={"center"}
              style={{ display: "initial" }}
            >
              <s.TextDescription
                style={{ textAlign: "left", color: "#ffffff", fontSize: 20 }}
              >
                Copyright © 2022
              </s.TextDescription>
            </s.Container>
            <s.Container
              flex={1}
              jc={"center"}
              ai={"center"}
              style={{ display: "initial" }}
            >
              <ResponsiveWrapper flex={1} test>
                <s.Container
                  flex={1}
                  jc={"center"}
                  ai={"center"}
                  style={{ display: "initial" }}
                >
                  <a
                    href="#"
                    style={{ float: "right", marginRight: 20 }}
                    target="_black"
                  >
                    <StyledImg
                      alt={"opensea"}
                      src={"/config/images/opensea.png"}
                      style={{ border: "none", borderRadius: 0, maxWidth: 42 }}
                    />
                  </a>
                  <a
                    href="#"
                    style={{ float: "right", marginRight: 20 }}
                    target="_black"
                  >
                    <StyledImg
                      alt={"discord"}
                      src={"/config/images/discord.png"}
                      style={{ border: "none", borderRadius: 0, maxWidth: 38 }}
                    />
                  </a>
                  <a
                    href="#"
                    style={{ float: "right", marginRight: 20 }}
                    target="_black"
                  >
                    <StyledImg
                      alt={"Instagram"}
                      src={"/config/images/Instagram.png"}
                      style={{ border: "none", borderRadius: 0, maxWidth: 38 }}
                    />
                  </a>
                  <a
                    href="#"
                    style={{ float: "right", marginRight: 20 }}
                    target="_black"
                  >
                    <StyledImg
                      alt={"twitter"}
                      src={"/config/images/twitter.png"}
                      style={{ border: "none", borderRadius: 0, maxWidth: 38 }}
                    />
                  </a>
                </s.Container>
              </ResponsiveWrapper>
            </s.Container>
          </ResponsiveWrapper>
        </s.Container>
      </s.Container>
    </s.Screen>
  );
}

export default App;
