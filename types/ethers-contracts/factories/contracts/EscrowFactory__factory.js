"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.EscrowFactory__factory = void 0;
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
var ethers_1 = require("ethers");
var _abi = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "string",
                name: "player1Id",
                type: "string"
            },
            {
                indexed: false,
                internalType: "address payable",
                name: "player1Address",
                type: "address"
            },
            {
                indexed: true,
                internalType: "string",
                name: "player2Id",
                type: "string"
            },
            {
                indexed: false,
                internalType: "address payable",
                name: "player2Address",
                type: "address"
            },
            {
                indexed: false,
                internalType: "address",
                name: "escrowAddress",
                type: "address"
            },
        ],
        name: "EscrowCreated",
        type: "event"
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_arbiter",
                type: "address"
            },
            {
                internalType: "string",
                name: "_player1Id",
                type: "string"
            },
            {
                internalType: "address payable",
                name: "_player1Address",
                type: "address"
            },
            {
                internalType: "uint256",
                name: "_player1BetAmount",
                type: "uint256"
            },
            {
                internalType: "string",
                name: "_player2Id",
                type: "string"
            },
            {
                internalType: "address payable",
                name: "_player2Address",
                type: "address"
            },
            {
                internalType: "uint256",
                name: "_player2BetAmount",
                type: "uint256"
            },
        ],
        name: "createEscrow",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
];
var _bytecode = "0x608060405234801561001057600080fd5b50612638806100206000396000f3fe60806040523480156200001157600080fd5b50600436106200002e5760003560e01c80635486b9cf1462000033575b600080fd5b6200005160048036038101906200004b919062000382565b62000053565b005b6000878787878787876040516200006a9062000119565b6200007c97969594939291906200052f565b604051809103906000f08015801562000099573d6000803e3d6000fd5b509050600081905084604051620000b19190620005fc565b604051809103902088604051620000c99190620005fc565b60405180910390207f951822cfd44ffa78c78583b78951ab287c18daf905a2eb181209149afa99b101898785604051620001069392919062000615565b60405180910390a3505050505050505050565b611fb0806200065383390190565b6000604051905090565b600080fd5b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600062000168826200013b565b9050919050565b6200017a816200015b565b81146200018657600080fd5b50565b6000813590506200019a816200016f565b92915050565b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b620001f582620001aa565b810181811067ffffffffffffffff82111715620002175762000216620001bb565b5b80604052505050565b60006200022c62000127565b90506200023a8282620001ea565b919050565b600067ffffffffffffffff8211156200025d576200025c620001bb565b5b6200026882620001aa565b9050602081019050919050565b82818337600083830152505050565b60006200029b62000295846200023f565b62000220565b905082815260208101848484011115620002ba57620002b9620001a5565b5b620002c784828562000275565b509392505050565b600082601f830112620002e757620002e6620001a0565b5b8135620002f984826020860162000284565b91505092915050565b60006200030f826200013b565b9050919050565b620003218162000302565b81146200032d57600080fd5b50565b600081359050620003418162000316565b92915050565b6000819050919050565b6200035c8162000347565b81146200036857600080fd5b50565b6000813590506200037c8162000351565b92915050565b600080600080600080600060e0888a031215620003a457620003a362000131565b5b6000620003b48a828b0162000189565b975050602088013567ffffffffffffffff811115620003d857620003d762000136565b5b620003e68a828b01620002cf565b9650506040620003f98a828b0162000330565b95505060606200040c8a828b016200036b565b945050608088013567ffffffffffffffff81111562000430576200042f62000136565b5b6200043e8a828b01620002cf565b93505060a0620004518a828b0162000330565b92505060c0620004648a828b016200036b565b91505092959891949750929550565b6200047e816200015b565b82525050565b600081519050919050565b600082825260208201905092915050565b60005b83811015620004c0578082015181840152602081019050620004a3565b60008484015250505050565b6000620004d98262000484565b620004e581856200048f565b9350620004f7818560208601620004a0565b6200050281620001aa565b840191505092915050565b620005188162000302565b82525050565b620005298162000347565b82525050565b600060e08201905062000546600083018a62000473565b81810360208301526200055a8189620004cc565b90506200056b60408301886200050d565b6200057a60608301876200051e565b81810360808301526200058e8186620004cc565b90506200059f60a08301856200050d565b620005ae60c08301846200051e565b98975050505050505050565b600081905092915050565b6000620005d28262000484565b620005de8185620005ba565b9350620005f0818560208601620004a0565b80840191505092915050565b60006200060a8284620005c5565b915081905092915050565b60006060820190506200062c60008301866200050d565b6200063b60208301856200050d565b6200064a604083018462000473565b94935050505056fe6101406040523480156200001257600080fd5b5060405162001fb038038062001fb08339818101604052810190620000389190620005b9565b6040518060400160405280600a81526020017f4d6f6e65794d61746368000000000000000000000000000000000000000000008152506040518060400160405280600181526020017f310000000000000000000000000000000000000000000000000000000000000081525060008280519060200120905060008280519060200120905060007f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f90508260e081815250508161010081815250504660a081815250506200010d8184846200030560201b60201c565b608081815250503073ffffffffffffffffffffffffffffffffffffffff1660c08173ffffffffffffffffffffffffffffffffffffffff16815250508061012081815250505050505050866000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060405180604001604052808781526020018673ffffffffffffffffffffffffffffffffffffffff1681525060016000820151816000019081620001da9190620008eb565b5060208201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055509050508360038190555060405180604001604052808481526020018373ffffffffffffffffffffffffffffffffffffffff1681525060056000820151816000019081620002709190620008eb565b5060208201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550905050806007819055506000600960146101000a81548160ff0219169083151502179055506000600960156101000a81548160ff0219169083151502179055505050505050505062000a6c565b600083838346306040516020016200032295949392919062000a0f565b6040516020818303038152906040528051906020012090509392505050565b6000604051905090565b600080fd5b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000620003828262000355565b9050919050565b620003948162000375565b8114620003a057600080fd5b50565b600081519050620003b48162000389565b92915050565b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6200040f82620003c4565b810181811067ffffffffffffffff82111715620004315762000430620003d5565b5b80604052505050565b60006200044662000341565b905062000454828262000404565b919050565b600067ffffffffffffffff821115620004775762000476620003d5565b5b6200048282620003c4565b9050602081019050919050565b60005b83811015620004af57808201518184015260208101905062000492565b60008484015250505050565b6000620004d2620004cc8462000459565b6200043a565b905082815260208101848484011115620004f157620004f0620003bf565b5b620004fe8482856200048f565b509392505050565b600082601f8301126200051e576200051d620003ba565b5b815162000530848260208601620004bb565b91505092915050565b6000620005468262000355565b9050919050565b620005588162000539565b81146200056457600080fd5b50565b60008151905062000578816200054d565b92915050565b6000819050919050565b62000593816200057e565b81146200059f57600080fd5b50565b600081519050620005b38162000588565b92915050565b600080600080600080600060e0888a031215620005db57620005da6200034b565b5b6000620005eb8a828b01620003a3565b975050602088015167ffffffffffffffff8111156200060f576200060e62000350565b5b6200061d8a828b0162000506565b9650506040620006308a828b0162000567565b9550506060620006438a828b01620005a2565b945050608088015167ffffffffffffffff81111562000667576200066662000350565b5b620006758a828b0162000506565b93505060a0620006888a828b0162000567565b92505060c06200069b8a828b01620005a2565b91505092959891949750929550565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680620006fd57607f821691505b602082108103620007135762000712620006b5565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b6000600883026200077d7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff826200073e565b6200078986836200073e565b95508019841693508086168417925050509392505050565b6000819050919050565b6000620007cc620007c6620007c0846200057e565b620007a1565b6200057e565b9050919050565b6000819050919050565b620007e883620007ab565b62000800620007f782620007d3565b8484546200074b565b825550505050565b600090565b6200081762000808565b62000824818484620007dd565b505050565b5b818110156200084c57620008406000826200080d565b6001810190506200082a565b5050565b601f8211156200089b57620008658162000719565b62000870846200072e565b8101602085101562000880578190505b620008986200088f856200072e565b83018262000829565b50505b505050565b600082821c905092915050565b6000620008c060001984600802620008a0565b1980831691505092915050565b6000620008db8383620008ad565b9150826002028217905092915050565b620008f682620006aa565b67ffffffffffffffff811115620009125762000911620003d5565b5b6200091e8254620006e4565b6200092b82828562000850565b600060209050601f8311600181146200096357600084156200094e578287015190505b6200095a8582620008cd565b865550620009ca565b601f198416620009738662000719565b60005b828110156200099d5784890151825560018201915060208501945060208101905062000976565b86831015620009bd5784890151620009b9601f891682620008ad565b8355505b6001600288020188555050505b505050505050565b6000819050919050565b620009e781620009d2565b82525050565b620009f8816200057e565b82525050565b62000a098162000375565b82525050565b600060a08201905062000a266000830188620009dc565b62000a356020830187620009dc565b62000a446040830186620009dc565b62000a536060830185620009ed565b62000a626080830184620009fe565b9695505050505050565b60805160a05160c05160e051610100516101205161150662000aaa6000396000505060005050600050506000505060005050600050506115066000f3fe6080604052600436106100c25760003560e01c8063d30895e41161007f578063e9170c3b11610059578063e9170c3b14610224578063f14125a71461024d578063f340fa0114610278578063f668f7b914610294576100c2565b8063d30895e4146101b6578063d65ab5f2146101e2578063dfbf53ae146101f9576100c2565b80632f6fe396146100c757806359a5f12d146100f25780635e123ce41461011e578063649a827f14610149578063b401faf114610174578063b9ecbe951461018b575b600080fd5b3480156100d357600080fd5b506100dc6102bf565b6040516100e99190610beb565b60405180910390f35b3480156100fe57600080fd5b506101076102d2565b604051610115929190610cd7565b60405180910390f35b34801561012a57600080fd5b5061013361038c565b6040516101409190610beb565b60405180910390f35b34801561015557600080fd5b5061015e61039f565b60405161016b9190610d20565b60405180910390f35b34801561018057600080fd5b506101896103a5565b005b34801561019757600080fd5b506101a06104af565b6040516101ad9190610d20565b60405180910390f35b3480156101c257600080fd5b506101cb6104b5565b6040516101d9929190610cd7565b60405180910390f35b3480156101ee57600080fd5b506101f761056f565b005b34801561020557600080fd5b5061020e6106bf565b60405161021b9190610d3b565b60405180910390f35b34801561023057600080fd5b5061024b60048036038101906102469190610dc5565b6106e5565b005b34801561025957600080fd5b50610262610a0e565b60405161026f9190610d20565b60405180910390f35b610292600480360381019061028d9190610e50565b610a14565b005b3480156102a057600080fd5b506102a9610bca565b6040516102b69190610d20565b60405180910390f35b600960159054906101000a900460ff1681565b60058060000180546102e390610eac565b80601f016020809104026020016040519081016040528092919081815260200182805461030f90610eac565b801561035c5780601f106103315761010080835404028352916020019161035c565b820191906000526020600020905b81548152906001019060200180831161033f57829003601f168201915b5050505050908060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905082565b600960149054906101000a900460ff1681565b60035481565b600960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610435576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161042c90610f4f565b60405180910390fd5b600960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc6008546004546104819190610f9e565b9081150290604051600060405180830381858888f193505050501580156104ac573d6000803e3d6000fd5b50565b60045481565b60018060000180546104c690610eac565b80601f01602080910402602001604051908101604052809291908181526020018280546104f290610eac565b801561053f5780601f106105145761010080835404028352916020019161053f565b820191906000526020600020905b81548152906001019060200180831161052257829003601f168201915b5050505050908060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905082565b6004546003541480156105855750600854600754145b6105c4576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105bb9061106a565b60405180910390fd5b600960149054906101000a900460ff1615610614576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161060b906110d6565b60405180910390fd5b6001600960146101000a81548160ff0219169083151502179055507fcc31230e7996101f992c2d8c94915e0df6f91b55aba0eaa74bcdc9eccf3c51d86001800160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166001600001600560010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1660056000016040516106b5949392919061118f565b60405180910390a1565b600960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610773576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161076a90611254565b60405180910390fd5b600960149054906101000a900460ff166107c2576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107b9906112e6565b60405180910390fd5b600960159054906101000a900460ff1615610812576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161080990611352565b60405180910390fd5b60016000016040516020016108279190611400565b60405160208183030381529060405280519060200120828260405160200161085092919061144b565b60405160208183030381529060405280519060200120036108d5576001800160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600960006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550610996565b60056000016040516020016108ea9190611400565b60405160208183030381529060405280519060200120828260405160200161091392919061144b565b604051602081830303815290604052805190602001200361099557600560010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600960006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b5b7f51b77d00d3c0b7e376e9ee146711ceb2c08e58a5dbe38055a618e52109f720c1600960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166040516109e79190610d3b565b60405180910390a16001600960156101000a81548160ff0219169083151502179055505050565b60075481565b6001800160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603610acd576003543414610aaf576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610aa6906114b0565b60405180910390fd5b3460046000828254610ac19190610f9e565b92505081905550610b84565b600560010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603610b83576007543414610b69576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b60906114b0565b60405180910390fd5b3460086000828254610b7b9190610f9e565b925050819055505b5b8073ffffffffffffffffffffffffffffffffffffffff167f20a3fe276908af20d1fa2f8f48225ac6a1997eb2d38695c580adeb4124a1a59b60405160405180910390a250565b60085481565b60008115159050919050565b610be581610bd0565b82525050565b6000602082019050610c006000830184610bdc565b92915050565b600081519050919050565b600082825260208201905092915050565b60005b83811015610c40578082015181840152602081019050610c25565b60008484015250505050565b6000601f19601f8301169050919050565b6000610c6882610c06565b610c728185610c11565b9350610c82818560208601610c22565b610c8b81610c4c565b840191505092915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610cc182610c96565b9050919050565b610cd181610cb6565b82525050565b60006040820190508181036000830152610cf18185610c5d565b9050610d006020830184610cc8565b9392505050565b6000819050919050565b610d1a81610d07565b82525050565b6000602082019050610d356000830184610d11565b92915050565b6000602082019050610d506000830184610cc8565b92915050565b600080fd5b600080fd5b600080fd5b600080fd5b600080fd5b60008083601f840112610d8557610d84610d60565b5b8235905067ffffffffffffffff811115610da257610da1610d65565b5b602083019150836001820283011115610dbe57610dbd610d6a565b5b9250929050565b60008060208385031215610ddc57610ddb610d56565b5b600083013567ffffffffffffffff811115610dfa57610df9610d5b565b5b610e0685828601610d6f565b92509250509250929050565b6000610e1d82610c96565b9050919050565b610e2d81610e12565b8114610e3857600080fd5b50565b600081359050610e4a81610e24565b92915050565b600060208284031215610e6657610e65610d56565b5b6000610e7484828501610e3b565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680610ec457607f821691505b602082108103610ed757610ed6610e7d565b5b50919050565b7f4f6e6c79207468652077696e6e65722063616e20636c61696d2074686520776960008201527f6e6e696e67732100000000000000000000000000000000000000000000000000602082015250565b6000610f39602783610c11565b9150610f4482610edd565b604082019050919050565b60006020820190508181036000830152610f6881610f2c565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000610fa982610d07565b9150610fb483610d07565b9250828201905080821115610fcc57610fcb610f6f565b5b92915050565b7f506c6179657273206d7573742068617665206465706f7369746564207468656960008201527f722062657420616d6f756e7473206265666f7265207374617274696e6720746860208201527f652067616d650000000000000000000000000000000000000000000000000000604082015250565b6000611054604683610c11565b915061105f82610fd2565b606082019050919050565b6000602082019050818103600083015261108381611047565b9050919050565b7f47616d6520616c72656164792073746172746564000000000000000000000000600082015250565b60006110c0601483610c11565b91506110cb8261108a565b602082019050919050565b600060208201905081810360008301526110ef816110b3565b9050919050565b60008190508160005260206000209050919050565b6000815461111881610eac565b6111228186610c11565b9450600182166000811461113d576001811461115357611186565b60ff198316865281151560200286019350611186565b61115c856110f6565b60005b8381101561117e5781548189015260018201915060208101905061115f565b808801955050505b50505092915050565b60006080820190506111a46000830187610cc8565b81810360208301526111b6818661110b565b90506111c56040830185610cc8565b81810360608301526111d7818461110b565b905095945050505050565b7f4f6e6c792074686520617262697465722063616e20656e64207468652067616d60008201527f6500000000000000000000000000000000000000000000000000000000000000602082015250565b600061123e602183610c11565b9150611249826111e2565b604082019050919050565b6000602082019050818103600083015261126d81611231565b9050919050565b7f47616d652068617320746f2062652073746172746564206265666f726520656e60008201527f64696e6700000000000000000000000000000000000000000000000000000000602082015250565b60006112d0602483610c11565b91506112db82611274565b604082019050919050565b600060208201905081810360008301526112ff816112c3565b9050919050565b7f47616d6520616c7265616479206f766572000000000000000000000000000000600082015250565b600061133c601183610c11565b915061134782611306565b602082019050919050565b6000602082019050818103600083015261136b8161132f565b9050919050565b600081905092915050565b6000815461138a81610eac565b6113948186611372565b945060018216600081146113af57600181146113c4576113f7565b60ff19831686528115158202860193506113f7565b6113cd856110f6565b60005b838110156113ef578154818901526001820191506020810190506113d0565b838801955050505b50505092915050565b600061140c828461137d565b915081905092915050565b82818337600083830152505050565b60006114328385611372565b935061143f838584611417565b82840190509392505050565b6000611458828486611426565b91508190509392505050565b7f496e636f72726563742062657420616d6f756e74000000000000000000000000600082015250565b600061149a601483610c11565b91506114a582611464565b602082019050919050565b600060208201905081810360008301526114c98161148d565b905091905056fea264697066735822122023ab6e4d26cf66ea05108e6c3b1d83d3d60acddb54b5f6666f5448dd7f3e5f3e64736f6c63430008110033a264697066735822122072de531f95d18a9563d1f149eaac6fb9ec0536b16eae5eec4908f9bedd1cfef564736f6c63430008110033";
var isSuperArgs = function (xs) { return xs.length > 1; };
var EscrowFactory__factory = /** @class */ (function (_super) {
    __extends(EscrowFactory__factory, _super);
    function EscrowFactory__factory() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _this = this;
        if (isSuperArgs(args)) {
            _this = _super.apply(this, args) || this;
        }
        else {
            _this = _super.call(this, _abi, _bytecode, args[0]) || this;
        }
        return _this;
    }
    EscrowFactory__factory.prototype.deploy = function (overrides) {
        return _super.prototype.deploy.call(this, overrides || {});
    };
    EscrowFactory__factory.prototype.getDeployTransaction = function (overrides) {
        return _super.prototype.getDeployTransaction.call(this, overrides || {});
    };
    EscrowFactory__factory.prototype.attach = function (address) {
        return _super.prototype.attach.call(this, address);
    };
    EscrowFactory__factory.prototype.connect = function (signer) {
        return _super.prototype.connect.call(this, signer);
    };
    EscrowFactory__factory.createInterface = function () {
        return new ethers_1.utils.Interface(_abi);
    };
    EscrowFactory__factory.connect = function (address, signerOrProvider) {
        return new ethers_1.Contract(address, _abi, signerOrProvider);
    };
    EscrowFactory__factory.bytecode = _bytecode;
    EscrowFactory__factory.abi = _abi;
    return EscrowFactory__factory;
}(ethers_1.ContractFactory));
exports.EscrowFactory__factory = EscrowFactory__factory;
