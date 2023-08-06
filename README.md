
# Halal-MeatChain-DApp-Using-Solidity-BlockChain-Project-

This is a blockchain project (Educational purposes only) using Solidity, truffle, Ganache etc to Create a blockchain DApp. The DApp will track meat from slaughter house to the super market. This is an educational project only. You can take Ideas for your Solidity learning from this project.

## 1.0.Introduction: The world is moving so fast and our Muslim ummah is also spreading 
very rapidly. But sadly, as the ummah is getting bigger and bigger day by day also in 
western world, it is very hard to find Halal foods in those countries. One big concern is 
consuming halal meat in the western world as well as in other part of the world. This is 
getting a global concern day by day. To help this situation, blockchain technology can be 
implemented to keep a track of halal meat in the industry.

## 2.0. Scope, Goal, Objective
1. Scope: Use blockchain technology to keep track of halal meat and give 
certification using digital signature.
2. Goal: To keep track and certify the farms as well as the seller who produce halal 
meat by using DApp (Decentralized Application)
3. Objective: Use smart contract and necessary scripts to build a DApp with front 
end. The front end can be used to make interaction in the blockchain.

## 3.0. Requirement Analysis
      3.1. Halal Meat Chain: Halal Meat chain will have the following chain:
      ![Picture1](https://github.com/asfi-ahmed/Halal-MeatChain-DApp-Using-Solidity-BlockChain-Project-/assets/104093139/5c313b55-bde6-4b16-9d05-f449ee72d3bf)

      3.2. System Actors: The system actors are listed below:
          ♦ Farms: The farms will be the manufacturer who will raise the halal animals.
          ♦ Distributor: The distributors will transport the product around different locations.
          ♦ Inspector: Performs quality checks on the products.
          ♦ Storage Facility: Stores the product in cold temperatures for long term.
          ♦ Seller: Sells the products in different stores and places and give halal certification to the customer.
          ♦ Customer: Buys products from the store.
          
## 4.0. System Design
    4.1. System Flow:
          ♦ Inspector issues certificate for batch to Manufacturer
          ♦ <batch status updated to MANUFACTURED>
          ♦ Manufacturer presents certificate to Distributor
          ♦ Distributor verifies each certificate
          ♦ <batch status updated to DELIVERING_INTERNATIONAL>
          ♦ Distributor presents updated certificate to Storage Facility
          ♦ Storage Facility verifies each batch certificate
          ♦ <batch status updated to STORED>
          ♦ Storage Facility presents certificates to Distributor
          ♦ Distributor verifies each certificate
          ♦ <batch status updated to DELIVERING_LOCAL>
          ♦ Distributor presents updated certificate to Seller
          ♦ Seller verifies certificates
          ♦ <batch status updated to DELIVERED>
          ♦ Seller sells meat to customers and issues halal certificates.
          ♦ <certificate issued with status Halal Certified>
    4.2. User Classification: The user classification is mentioned below:
          ![Picture2](https://github.com/asfi-ahmed/Halal-MeatChain-DApp-Using-Solidity-BlockChain-Project-/assets/104093139/be72342c-5f15-4902-b106-11abfbf3c583)

    4.3. Use-Cases: The use cases are listed below:
          ♦ An Issuer can issue a signature representing a digital certificate for a farm.
          ♦ A Prover can present a certificate/signature issued.
          ♦ A Verifier can validate the signature on the blockchain for a halal meat.
          
## 5.0. Tools Used 
For this project, we have used several tools such as Remix Online IDE, 
Truffle suit, NPM, Node.js, Ganache, VScode.
1. Remix Online IDE: We used Remix Online IDE for initial smart contract writing and 
                      compiling.
2. Truffle Suit: We used Truffle Suit to make Dapp project folder and advanced smart contract writing, compiling as well as deploying the smart contract in the blockchain.
3. NPM: Npm is used in this project to manage javascript software packages.
4. Node.js: We used Node.js for server-side programming.
5. Ganache: Ganache is used in this project for deploying the smart contract in the blockchain as ganache offers a personal blockchain for development purposes. We used ganache for faster deployment of our smart contract in the blockchain for testing purposes.
6. VScode: We used VScode as our text editor to write smart contracts as well as necessary scripts for development of our Dapp. We used above mentioned software as extension in VScode.

## 6.0. Source Code:
    6.1. Smart Contract: The source code of the smart contract is below:
          pragma solidity ^0.8.17;
          library CryptoSuite {
          function splitSignature(bytes memory sig) internal pure returns(uint8 v, 
          bytes32 r, bytes32 s) {
          require(sig.length == 65);
          assembly {
          // first 32bytes
          r :=mload(add(sig, 32))
          // next 32bytes
          s :=mload(add(sig, 64))
          // last 32bytes
          v := byte(0, mload(add(sig, 96)))
          }
          return (v, r, s);
          }
          function recoverSigner(bytes32 message, bytes memory sig) internal pure
          returns (address) {
          (uint8 v, bytes32 r, bytes32 s) = splitSignature(sig);
          bytes memory prefix = "\x19Ethereum Signed Message:\n32";
          bytes32 prefixedHash = keccak256(abi.encodePacked(prefix, message));
          return ecrecover(message, v, r, s);
          }
          }
          contract HalalMeat {
          enum Mode { ISSUER, PROVER, VERIFIER}
          struct Entity {
          address id;
          Mode mode;
          uint[] certificateIds;
          }
          enum Status {MANUFACTURED, DELIVERING_INTERNATIONAL, STORED, 
          DELIVERING_LOCAL, DELIVERED}
          struct Certificate {
          uint id;
          Entity issuer;
          Entity prover;
          bytes signature;
          Status status;
          }
          struct MeatBatch {
          uint id;
          string brand;
          address farm;
          uint[] certificateIds;
          }
          uint public constant MAX_CERTIFICATIONS = 2;
          uint[] public certificateIds;
          uint[] public meatBatchIds;
          mapping (uint => MeatBatch) public meatBatches;
          mapping (uint => Certificate) public certificates;
          mapping (address => Entity) public entities;
          event AddEntity(address entityId, string entityMode);
          event AddMeatBatch(uint meatBatchId, address indexed farm);
          event IssueCertificate(address indexed issuer, address indexed prover, uint
          certificateId);
          function addEntity(address _id, string memory _mode) public {
          Mode mode = unmarshalMode(_mode);
          uint[] memory _certificateIds = new uint[](MAX_CERTIFICATIONS);
          Entity memory entity = Entity(_id, mode, _certificateIds);
          entities[_id] = entity;
          emit AddEntity(entity.id, _mode);
          }
          function unmarshalMode(string memory _mode) private pure returns(Mode mode) {
          bytes32 encodedMode = keccak256(abi.encodePacked(_mode));
          bytes32 encodedMode0 = keccak256(abi.encodePacked("ISSUER"));
          bytes32 encodedMode1 = keccak256(abi.encodePacked("PROVER"));
          bytes32 encodedMode2 = keccak256(abi.encodePacked("VERIFIER"));
          if(encodedMode == encodedMode0) {
          return Mode.ISSUER;
          }
          else if(encodedMode == encodedMode1){
          return Mode.PROVER;
          }
          else if(encodedMode == encodedMode2){
          return Mode.VERIFIER;
          }
          revert("recieved invalid entity mode");
          }
          function addMeatBatch(string memory brand, address farm) public returns(uint) 
          {
          uint[] memory _certificateIds = new uint[](MAX_CERTIFICATIONS);
          uint id = meatBatchIds.length;
          MeatBatch memory batch = MeatBatch(id, brand, farm, _certificateIds);
          meatBatches[id] = batch;
          meatBatchIds.push(id);
          emit AddMeatBatch(batch.id, batch.farm);
          return id;
          }
          function issueCertificate(
          address _issuer, address _prover, string memory _status, 
          uint meatBatchId, bytes memory signature) public returns (uint) {
          Entity memory issuer = entities[_issuer];
          require (issuer.mode == Mode.ISSUER);
          Entity memory prover = entities[_prover];
          require (prover.mode == Mode.PROVER);
          Status status = unmarshalStatus(_status);
          uint id = certificateIds.length;
          Certificate memory certificate = Certificate(id, issuer, prover, 
          signature, status);
          certificateIds.push(certificateIds.length);
          certificates[certificateIds.length-1] = certificate;
          emit IssueCertificate(_issuer, _prover, certificateIds.length-1);
          return certificateIds.length-1;
          }
          function unmarshalStatus(string memory _status) private pure
          returns(Status status) {
          bytes32 encodedStatus = keccak256(abi.encodePacked(_status));
          bytes32 encodedStatus0 = keccak256(abi.encodePacked("MANUFACTURED"));
          bytes32 encodedStatus1 = 
          keccak256(abi.encodePacked("DELIVERING_INTERNATIONAL"));
          bytes32 encodedStatus2 = keccak256(abi.encodePacked("STORED"));
          bytes32 encodedStatus3 = keccak256(abi.encodePacked("DELIVERING_LOCAL"));
          bytes32 encodedStatus4 = keccak256(abi.encodePacked("DELIVERED"));
          if(encodedStatus == encodedStatus0) {
          return Status.MANUFACTURED;
          }
          else if(encodedStatus == encodedStatus1) {
          return Status.DELIVERING_INTERNATIONAL;
          }
          else if(encodedStatus == encodedStatus2) {
          return Status.STORED;
          }
          else if(encodedStatus == encodedStatus3) {
          return Status.DELIVERING_LOCAL;
          }
          else if(encodedStatus == encodedStatus4) {
          10 | Page
          return Status.DELIVERED;
          }
          revert("recieved invalid entity mode");
          }
          function isMatchingSignature(bytes32 message, uint id, address issuer) public
          view returns (bool) {
          Certificate memory cert = certificates[id];
          require(cert.issuer.id == issuer);
          address recoveredSigner = CryptoSuite.recoverSigner(message, 
          cert.signature);
          return recoveredSigner == cert.issuer.id;
          }
          }
    6.2. JavaScript: The source code of test JavaScript is below:
          const { expectEvent, BN } = require("@openzeppelin/test-helpers");
          const HDWalletProvider = require("@truffle/hdwallet-provider");
          const Web3 = require("Web3");
          const HalalMeat = artifacts.require("HalalMeat");
          contract("HalalMeat", (accounts) => {
          before(async () => {
          this.owner = accounts[0]; 
          this.MEAT_BRANDS = {
          GHagro: "Golden Harvest Agro Industries",
          Kazifood: "Kazi Food Industries",
          AGagro: "Ahsan Group Agro Foods",
          Bengalmeat: "Bengal Meat ltd",
          Sagro: "Sadek Agro ltd"
          };
          //enums
          this.ModeEnums = {
          ISSUER: { val: "ISSUER", pos: 0 },
          PROVER: { val: "PROVER", pos: 1 },
          VERIFIER: { val: "VERIFIER", pos: 2 }
          };
          this.StatusEnums = {
          //MANUFACTURED, DELIVERING_INTERNATIONAL, STORED, DELIVERING_LOCAL, 
          DELIVERED
          manufactured: { val: "IMANUFACTURED", pos: 0 },
          delivering1: { val: "DELIVERING_INTERNATIONAL", pos: 1 },
          stored: { val: "STORED", pos: 2 },
          delivering2: { val: "DELIVERING_LOCAL", pos: 3 },
          delivered: { val: "DELIVERED", pos: 4 }
          };
          this.defaultEntities = {
          farmA: { id: accounts[1], mode: this.ModeEnums.PROVER.val },
          farmB: { id: accounts[2], mode: this.ModeEnums.PROVER.val },
          inspector: { id: accounts[3], mode: this.ModeEnums.ISSUER.val },
          distributorGlobal: { id: accounts[4], mode: this.ModeEnums.VERIFIER.val },
          distributorLocal: { id: accounts[5], mode: this.ModeEnums.VERIFIER.val },
          seller: { id: accounts[6], mode: this.ModeEnums.ISSUER.val },
          customer: { id: accounts[7], mode: this.ModeEnums.PROVER.val }
          };
          this.defaultMeatBatches ={
          0: { brand: this.MEAT_BRANDS.Bengalmeat, farm:
          this.defaultEntities.farmA.id },
          1: { brand: this.MEAT_BRANDS.Sagro, farm: this.defaultEntities.farmA.id },
          2: { brand: this.MEAT_BRANDS.Kazifood, farm: this.defaultEntities.farmA.id
          },
          3: { brand: this.MEAT_BRANDS.GHagro, farm: this.defaultEntities.farmA.id },
          4: { brand: this.MEAT_BRANDS.AGagro, farm: this.defaultEntities.farmA.id },
          5: { brand: this.MEAT_BRANDS.Bengalmeat, farm:
          this.defaultEntities.farmB.id },
          6: { brand: this.MEAT_BRANDS.Sagro, farm: this.defaultEntities.farmB.id },
          7: { brand: this.MEAT_BRANDS.Kazifood, farm: this.defaultEntities.farmB.id
          },
          8: { brand: this.MEAT_BRANDS.GHagro, farm: this.defaultEntities.farmB.id },
          9: { brand: this.MEAT_BRANDS.AGagro, farm: this.defaultEntities.farmB.id }
          };
          this.halalMeatInstance = await HalalMeat.deployed();
          });
          it('should add entities successfully', async () => {
          for(const entity in this.defaultEntities){
          const { id, mode } = this.defaultEntities[entity];
          const result = await this.halalMeatInstance.addEntity(
          id,
          mode,
          { from: this.owner}
          );
          //console.log(result);
          expectEvent(result.receipt, "AddEntity", {
          entityId: id,
          entityMode: mode
          });
          const retrievedEntity = await this.halalMeatInstance.entities.call(id);
          assert.equal(id, retrievedEntity.id, "MisMatched Ids");
          assert.equal(this.ModeEnums[mode].pos, retrievedEntity.mode.toString(), 
          "MisMatched Modes");
          }
          });
          it('should add meat batches successfully', async () => {
          for(let i = 0; i < Object.keys(this.defaultMeatBatches).length; i++){
          const { brand, farm } = this.defaultMeatBatches[i];
          const result = await this.halalMeatInstance.addMeatBatch(
          brand,
          farm,
          { from: this.owner}
          );
          console.log(result);
          expectEvent(result.receipt, "AddMeatBatch", {
          meatBatchId: String(i),
          farm: farm
          });
          const retrievedMeatBatch = await
          this.halalMeatInstance.meatBatches.call(i);
          assert.equal(i, retrievedMeatBatch.id);
          assert.equal(brand, retrievedMeatBatch.brand);
          assert.equal(farm, retrievedMeatBatch.farm);
          assert.equal(undefined, retrievedMeatBatch.certificate);
          }
          });
          it('should sign a message and store as a certificate from the issuer to the 
          prover', async () => {
          const mnemonic = "tissue march season suggest teach manual engine sister 
          depth grass virus blouse";
          const providerOrUrl = "http://localhost:8545";
          const provider = new HDWalletProvider({
          mnemonic,
          providerOrUrl
          });
          this.web3 = new Web3(provider);
          const {inspector, farmA} = this.defaultEntities;
          const meatBatchId = 3;
          const message = `Inspector (${inspector.id}) has certified meat batch 
          #${meatBatchId} for Farm (${farmA.id}).`;
          const signature = await this.web3.eth.sign(
          this.web3.utils.keccak256(message),
          inspector.id
          );
          const result = await this.halalMeatInstance.issueCertificate(
          inspector.id,
          farmA.id,
          this.StatusEnums.manufactured.val,
          meatBatchId,
          signature,
          { from: this.owner}
          );
          expectEvent(result.receipt, "IssueCertificate", {
          issuer: inspector.id,
          prover: farmA.id,
          certificateId: new BN(0)
          });
          });
          });

## 7.0. Evidence Screenshots:
![Picture5](https://github.com/asfi-ahmed/Halal-MeatChain-DApp-Using-Solidity-BlockChain-Project-/assets/104093139/d2092e4d-e76c-4113-bf76-c39b9a8488be)
![Picture5](https://github.com/asfi-ahmed/Halal-MeatChain-DApp-Using-Solidity-BlockChain-Project-/assets/104093139/9b25a65d-afe3-47ac-8425-d2a0d6ac2526)


## 8.0. Front End:
![Picture8](https://github.com/asfi-ahmed/Halal-MeatChain-DApp-Using-Solidity-BlockChain-Project-/assets/104093139/0a5f4aa4-4b02-467c-a473-951c3502036c)
![Picture6](https://github.com/asfi-ahmed/Halal-MeatChain-DApp-Using-Solidity-BlockChain-Project-/assets/104093139/4e34bd85-1a96-4d00-beef-bec73a907036)

## 9.0.	Conclusion
This is a backend framework for the Halal meat DApp. As already can be seen that all data can be upload in to blockchain and it will also allow certification via digital signature. By using this framework, the Dapp will be developed, and it will help the Muslim Ummah to spend a better life in this fast-paced world. 

## 10.0.	References:
          i)	Solidity Programming Essentials: A beginner's guide to build smart contracts for Ethereum and blockchain
          ii)	https://remix-ide.readthedocs.io/en/latest/
          iii)	https://trufflesuite.com/docs/
          iv)	https://docs.npmjs.com/
          v)	https://nodejs.org/en/docs/
          vi)	https://trufflesuite.com/docs/ganache/
          vii)	 https://code.visualstudio.com/docs
          viii)	https://stackoverflow.com/questions/tagged/solidity
          ix)	Lecture Slides by Norbik Bashah Bin Idris (Dato' Prof. Dr.)
