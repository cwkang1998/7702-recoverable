// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {MultiSendCallOnly} from "./utils/MultiSend.sol";
import {ECDSA} from "./utils/ECDSA.sol";
import {P256} from "./utils/P256.sol";
import {WebAuthnP256} from "./utils/WebAuthnP256.sol";

/// @title ExperimentDelegation
/// @author jxom <https://github.com/jxom>
/// @notice Experimental EIP-7702 delegation contract that allows authorized Keys to invoke calls on behalf of an Authority.
/// @dev WARNING: THIS CONTRACT IS AN EXPERIMENT AND HAS NOT BEEN AUDITED.
contract ExperimentDelegation is MultiSendCallOnly {
    ////////////////////////////////////////////////////////////////////////
    // Data Structures
    ////////////////////////////////////////////////////////////////////////

    /// @notice The type of key.
    enum KeyType {
        P256,
        WebAuthnP256
    }

    /// @notice A Key that can be used to authorize calls.
    /// @custom:property authorized - Whether the key is authorized.
    /// @custom:property publicKey - ECDSA public key.
    /// @custom:property expiry - Unix timestamp at which the key expires.
    /// @custom:property keyType - Type of key.
    struct Key {
        bool authorized;
        uint256 expiry;
        KeyType keyType;
        ECDSA.PublicKey publicKey;
    }

    ////////////////////////////////////////////////////////////////////////
    // Errors
    ////////////////////////////////////////////////////////////////////////

    /// @notice Thrown when an address is not found for a nullifier
    error AccountNotFound();

    /// @notice Thrown when a key is expired.
    error KeyExpired();

    /// @notice Thrown when a key is not authorized.
    error KeyNotAuthorized();

    /// @notice Thrown when the sender is not the Authority.
    error InvalidAuthority();

    /// @notice Thrown when a signature is invalid.
    error InvalidSignature();

    ////////////////////////////////////////////////////////////////////////
    // Functions
    ////////////////////////////////////////////////////////////////////////

    /// @notice List of keys associated with the Authority.
    Key[] public keys;

    /// @notice Internal nonce used for replay protection.
    uint256 public nonce;

    /// @notice Authorizes a new public key on behalf of the Authority, provided the Authority's signature.
    /// @param publicKey - The public key to authorize.
    /// @param keyType - The type of key. 0 = P256, 1 = WebAuthn-P256, 2 = WebCrypto-P256.
    /// @param expiry - The Unix timestamp at which the key expires.
    /// @param signature - EOA secp256k1 signature over the public key.
    function authorize(
        ECDSA.PublicKey calldata publicKey,
        KeyType keyType,
        uint256 expiry,
        ECDSA.RecoveredSignature calldata signature
    ) public returns (uint32 publicKeyIndex) {
        bytes32 digest = keccak256(abi.encodePacked(nonce++, publicKey.x, publicKey.y, expiry));
        address signer = ecrecover(digest, signature.yParity == 0 ? 27 : 28, bytes32(signature.r), bytes32(signature.s));
        if (signer != address(this)) revert InvalidSignature();

        Key memory key = Key({authorized: true, expiry: expiry, keyType: keyType, publicKey: publicKey});
        keys.push(key);

        return uint32(keys.length - 1);
    }

    /// @notice Revokes an authorized public key on behalf of the Authority, provided the Authority's signature.
    /// @param publicKeyIndex - The index of the public key to revoke.
    /// @param signature - EOA secp256k1 signature over the public key index.
    function revoke(uint32 publicKeyIndex, ECDSA.RecoveredSignature calldata signature) public {
        bytes32 digest = keccak256(abi.encodePacked(nonce++, publicKeyIndex));
        address signer = ecrecover(digest, signature.yParity == 0 ? 27 : 28, bytes32(signature.r), bytes32(signature.s));
        if (signer != address(this)) revert InvalidSignature();
        keys[publicKeyIndex].authorized = false;
    }

    /// @notice Executes a set of calls on behalf of the Authority, provided a WebAuthn-wrapped P256 signature over the calls, the WebAuthn metadata, and an invoker index.
    /// @param calls - The calls to execute.
    /// @param signature - The WebAuthn-wrapped P256 signature over the calls: `p256.sign(keccak256(nonce ‖ calls))`.
    /// @param metadata - The WebAuthn metadata.
    /// @param publicKeyIndex - The index of the authorized public key to use.
    /// @param prehash - Whether to SHA-256 hash the digest.
    function execute(
        bytes memory calls,
        ECDSA.Signature memory signature,
        WebAuthnP256.Metadata memory metadata,
        uint32 publicKeyIndex,
        bool prehash
    ) public {
        bytes32 challenge = keccak256(abi.encodePacked(nonce++, calls));
        if (prehash) challenge = sha256(abi.encodePacked(challenge));

        Key memory key = keys[publicKeyIndex];
        if (!key.authorized) revert KeyNotAuthorized();
        if (key.expiry > 0 && key.expiry < block.timestamp) revert KeyExpired();

        if (!WebAuthnP256.verify(challenge, metadata, signature, key.publicKey)) {
            revert InvalidSignature();
        }

        multiSend(calls);
    }

    /// @notice Verify a self proof
    /// @notice If proof is valid, revoke specified key and authorize new key
    /// @param publicKey New public key
    /// @param keyType New key type
    /// @param expiry Expiry for the new key
    function recoverAccount(ECDSA.PublicKey calldata publicKey, KeyType keyType, uint256 expiry, uint256 keyIndex)
        public
    {
        // TODO: we need access control here

        // Revoke old key
        keys[keyIndex].authorized = false;

        // Authorize new key
        Key memory key = Key({authorized: true, expiry: expiry, keyType: keyType, publicKey: publicKey});
        keys.push(key);
    }

    function getLatestKeyIndex() public view returns (uint256 keyIndex) {
        keyIndex = keys.length - 1;
    }

    fallback() external payable {}
    receive() external payable {}
}
