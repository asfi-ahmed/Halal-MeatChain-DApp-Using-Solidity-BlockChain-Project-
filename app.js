// Connect to the smart contract using web3
if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
  } else {
    // set the provider you want from Web3.providers
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }
  
  // ABI and contract address of the deployed smart contract
  var abi = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "entityId",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "entityMode",
				"type": "string"
			}
		],
		"name": "AddEntity",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "meatBatchId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "farm",
				"type": "address"
			}
		],
		"name": "AddMeatBatch",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "issuer",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "prover",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "certificateId",
				"type": "uint256"
			}
		],
		"name": "IssueCertificate",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "MAX_CERTIFICATIONS",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_id",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_mode",
				"type": "string"
			}
		],
		"name": "addEntity",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "brand",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "farm",
				"type": "address"
			}
		],
		"name": "addMeatBatch",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "certificateIds",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "certificates",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"components": [
					{
						"internalType": "address",
						"name": "id",
						"type": "address"
					},
					{
						"internalType": "enum HalalMeat.Mode",
						"name": "mode",
						"type": "uint8"
					},
					{
						"internalType": "uint256[]",
						"name": "certificateIds",
						"type": "uint256[]"
					}
				],
				"internalType": "struct HalalMeat.Entity",
				"name": "issuer",
				"type": "tuple"
			},
			{
				"components": [
					{
						"internalType": "address",
						"name": "id",
						"type": "address"
					},
					{
						"internalType": "enum HalalMeat.Mode",
						"name": "mode",
						"type": "uint8"
					},
					{
						"internalType": "uint256[]",
						"name": "certificateIds",
						"type": "uint256[]"
					}
				],
				"internalType": "struct HalalMeat.Entity",
				"name": "prover",
				"type": "tuple"
			},
			{
				"internalType": "bytes",
				"name": "signature",
				"type": "bytes"
			},
			{
				"internalType": "enum HalalMeat.Status",
				"name": "status",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "entities",
		"outputs": [
			{
				"internalType": "address",
				"name": "id",
				"type": "address"
			},
			{
				"internalType": "enum HalalMeat.Mode",
				"name": "mode",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "message",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "issuer",
				"type": "address"
			}
		],
		"name": "isMatchingSignature",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_issuer",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_prover",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_status",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "meatBatchId",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "signature",
				"type": "bytes"
			}
		],
		"name": "issueCertificate",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "meatBatchIds",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "meatBatches",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "brand",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "farm",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
  var contractAddress = '0x8577Abb93dC3d19e5EC73CB7438f6DD6A3cF04b6';
  
  // Connect to the contract
  var contract = web3.eth.contract(abi).at(contractAddress);
  
  // Add Entity
  var addEntityButton = document.getElementById("add-entity-button");
  addEntityButton.addEventListener("click", function() {
      var entityId = document.getElementById("entity-id-input").value;
      var entityMode = document.getElementById("entity-mode-input").value;
      contract.addEntity(entityId, entityMode, {from: web3.eth.accounts[0], gas: 1000000}, function(error, result){
          if(!error){
              console.log("Entity added: ", result);
          }else{
            console.error(error);
        }
    });
});

// Add Meat Batch
var addMeatBatchButton = document.getElementById("add-meatbatch-button");
addMeatBatchButton.addEventListener("click", function() {
    var brand = document.getElementById("brand-input").value;
    var farm = document.getElementById("farm-input").value;
    contract.addMeatBatch(brand, farm, {from: web3.eth.accounts[0], gas: 1000000}, function(error, result){
        if(!error){
            console.log("Meat Batch added: ", result);
        }else{
            console.error(error);
        }
    });
});

// Issue Certificate
var issueCertificateButton = document.getElementById("issue-certificate-button");
issueCertificateButton.addEventListener("click", function() {
    var issuerId = document.getElementById("issuer-id-input").value;
    var proverId = document.getElementById("prover-id-input").value;
    var status = document.getElementById("status-input").value;
    var meatBatchId = document.getElementById("meatbatch-id-input").value;
    var signature = document.getElementById("signature-input").value;
    contract.issueCertificate(issuerId, proverId, status, meatBatchId, signature, {from: web3.eth.accounts[0], gas: 1000000}, function(error, result){
        if(!error){
            console.log("Certificate issued: ", result);
        }else{
            console.error(error);
        }
    });
});

// Get Meat Batch
var getMeatBatchButton = document.getElementById("get-meatbatch-button");
getMeatBatchButton.addEventListener("click", function() {
    var meatBatchId = document.getElementById("meatbatch-id-input").value;
    contract.meatBatches(meatBatchId, function(error, result) {
        if(!error) {
            console.log("Meat Batch: ", result);
            // display result on front-end
        } else {
            console.error(error);
        }
    });
});

// Get Certificate
var getCertificateButton = document.getElementById("get-certificate-button");
getCertificateButton.addEventListener("click", function() {
    var certificateId = document.getElementById("certificate-id-input").value;
    contract.certificates(certificateId, function(error, result) {
        if(!error) {
            console.log("Certificate: ", result);
            // display result on front-end
        } else {
            console.error(error);
        }
    });
});


  
