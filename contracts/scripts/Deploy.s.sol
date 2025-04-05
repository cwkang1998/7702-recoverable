// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {ExperimentDelegation} from "../src/ExperimentDelegation.sol";
import {ExperimentERC20} from "../src/ExperimentERC20.sol";

contract Deploy is Script {
    function run() public {
        // Get deployment private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        // Deploy ExperimentDelegation
        ExperimentDelegation delegation = new ExperimentDelegation();

        // Deploy ExperimentERC20 with contract deployer as authorized origin
        ExperimentERC20 token = new ExperimentERC20();

        vm.stopBroadcast();

        // Log deployed addresses
        console.log("ExperimentDelegation deployed to:", address(delegation));
        console.log("ExperimentERC20 deployed to:", address(token));
    }
}
