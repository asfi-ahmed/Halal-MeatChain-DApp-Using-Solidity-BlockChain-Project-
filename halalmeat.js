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
			//MANUFACTURED, DELIVERING_INTERNATIONAL, STORED, DELIVERING_LOCAL, DELIVERED
			manufactured: { val: "MANUFACTURED", pos: 0 },
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
      0: { brand: this.MEAT_BRANDS.Bengalmeat, farm: this.defaultEntities.farmA.id },
      1: { brand: this.MEAT_BRANDS.Sagro, farm: this.defaultEntities.farmA.id },
      2: { brand: this.MEAT_BRANDS.Kazifood, farm: this.defaultEntities.farmA.id },
      3: { brand: this.MEAT_BRANDS.GHagro, farm: this.defaultEntities.farmA.id },
      4: { brand: this.MEAT_BRANDS.AGagro, farm: this.defaultEntities.farmA.id },
      5: { brand: this.MEAT_BRANDS.Bengalmeat, farm: this.defaultEntities.farmB.id },
      6: { brand: this.MEAT_BRANDS.Sagro, farm: this.defaultEntities.farmB.id },
      7: { brand: this.MEAT_BRANDS.Kazifood, farm: this.defaultEntities.farmB.id },
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

      console.log(result);
      expectEvent(result.receipt, "AddEntity", {
        entityId: id,
        entityMode: mode
      });
      
      const retrievedEntity = await this.halalMeatInstance.entities.call(id);
      assert.equal(id, retrievedEntity.id, "MisMatched Ids");
      assert.equal(this.ModeEnums[mode].pos, retrievedEntity.mode.toString(), "MisMatched Modes");
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
      
      const retrievedMeatBatch = await this.halalMeatInstance.meatBatches.call(i);
      assert.equal(i, retrievedMeatBatch.id);
      assert.equal(brand, retrievedMeatBatch.brand);
      assert.equal(farm, retrievedMeatBatch.farm);
      assert.equal(undefined, retrievedMeatBatch.certificate);
      
    }
	});


  

  it('should sign a message', async () => {
    const mnemonic = "elite bread tag also dynamic task until cannon length grocery sponsor suspect";
    const providerOrUrl = "HTTP://127.0.0.1:8545";

    


    const provider = new HDWalletProvider({

      mnemonic,
      providerOrUrl
    });

    this.web3 = new Web3(provider);

    const {inspector, farmA} = this.defaultEntities;
    const meatBatchId = 0;
    const message = `Inspector (${inspector.id}) has certified meat batch #${meatBatchId} for Farm (${farmA.id}).`;

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
        certificateId: new BN()
      });

	});
});


//inspector.id