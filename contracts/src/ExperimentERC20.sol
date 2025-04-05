// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.23;

import {ERC20} from "solady/tokens/ERC20.sol";

contract ExperimentERC20 is ERC20 {
    function name() public view virtual override returns (string memory) {
        return "ExperimentERC20";
    }

    function symbol() public view virtual override returns (string memory) {
        return "EXP";
    }

    function decimals() public view virtual override returns (uint8) {
        return 18;
    }

    function burnForEther(uint256 amount) public virtual {
        _burn(msg.sender, amount);
        payable(msg.sender).transfer(amount / 1000);
    }

    function mintForEther() public payable virtual {
        uint256 amount = msg.value * 1000;
        _mint(msg.sender, amount);
    }

    function mint(address to, uint256 value) public virtual {
        _mint(to, value);
    }

    function transfer(address to, uint256 amount) public virtual override returns (bool) {
        return super.transfer(to, amount);
    }

    fallback() external payable {}
    receive() external payable {}
}
