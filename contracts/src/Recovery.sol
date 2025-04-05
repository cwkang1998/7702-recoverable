// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {SelfVerificationRoot} from "@selfxyz/contracts/contracts/abstract/SelfVerificationRoot.sol";
import {ISelfVerificationRoot} from "@selfxyz/contracts/contracts/interfaces/ISelfVerificationRoot.sol";
import {IVcAndDiscloseCircuitVerifier} from "@selfxyz/contracts/contracts/interfaces/IVcAndDiscloseCircuitVerifier.sol";
import {IIdentityVerificationHubV1} from "@selfxyz/contracts/contracts/interfaces/IIdentityVerificationHubV1.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {CircuitConstants} from "@selfxyz/contracts/contracts/constants/CircuitConstants.sol";

/// @title Recovery
/// @notice Contract for managing account recovery using selfxyz's proof and nullifier system
contract Recovery is SelfVerificationRoot, Ownable {
    ////////////////////////////////////////////////////////////////////////
    // Storage
    ////////////////////////////////////////////////////////////////////////

    /// @notice Mapping from account address to their recovery key
    mapping(address => bytes) public accountRecoveryKeys;

    /// @notice Mapping to track used nullifiers
    mapping(uint256 => bool) internal _nullifiers;

    ////////////////////////////////////////////////////////////////////////
    // Events
    ////////////////////////////////////////////////////////////////////////

    /// @notice Emitted when a recovery key is set for an account
    event RecoveryKeySet(address indexed account, bytes publicKey);

    /// @notice Emitted when an account is recovered
    event AccountRecovered(address indexed oldAccount, address indexed newAccount);

    ////////////////////////////////////////////////////////////////////////
    // Errors
    ////////////////////////////////////////////////////////////////////////

    /// @notice Thrown when a nullifier has already been used
    error RegisteredNullifier();

    /// @notice Thrown when a key is not authorized
    error KeyNotAuthorized();

    ////////////////////////////////////////////////////////////////////////
    // Constructor
    ////////////////////////////////////////////////////////////////////////

    constructor(
        address _identityVerificationHub,
        uint256 _scope,
        uint256 _attestationId,
        bool _olderThanEnabled,
        uint256 _olderThan,
        bool _forbiddenCountriesEnabled,
        uint256[4] memory _forbiddenCountriesListPacked,
        bool[3] memory _ofacEnabled
    )
        SelfVerificationRoot(
            _identityVerificationHub,
            _scope,
            _attestationId,
            _olderThanEnabled,
            _olderThan,
            _forbiddenCountriesEnabled,
            _forbiddenCountriesListPacked,
            _ofacEnabled
        )
        Ownable(_msgSender())
    {}

    ////////////////////////////////////////////////////////////////////////
    // Functions
    ////////////////////////////////////////////////////////////////////////

    /// @notice Set a recovery key for an account
    /// @param publicKey The public key to use for recovery
    function setRecoveryKey(bytes calldata publicKey) external {
        accountRecoveryKeys[msg.sender] = publicKey;
        emit RecoveryKeySet(msg.sender, publicKey);
    }

    /// @notice Verify a self proof and recover account if valid
    /// @param proof The proof of recovery
    function verifySelfProof(IVcAndDiscloseCircuitVerifier.VcAndDiscloseProof memory proof) public override {
        if (_scope != proof.pubSignals[CircuitConstants.VC_AND_DISCLOSE_SCOPE_INDEX]) {
            revert InvalidScope();
        }

        if (_attestationId != proof.pubSignals[CircuitConstants.VC_AND_DISCLOSE_ATTESTATION_ID_INDEX]) {
            revert InvalidAttestationId();
        }

        if (_nullifiers[proof.pubSignals[CircuitConstants.VC_AND_DISCLOSE_NULLIFIER_INDEX]]) {
            revert RegisteredNullifier();
        }

        IIdentityVerificationHubV1.VcAndDiscloseVerificationResult memory result = _identityVerificationHub
            .verifyVcAndDisclose(
            IIdentityVerificationHubV1.VcAndDiscloseHubProof({
                olderThanEnabled: _verificationConfig.olderThanEnabled,
                olderThan: _verificationConfig.olderThan,
                forbiddenCountriesEnabled: _verificationConfig.forbiddenCountriesEnabled,
                forbiddenCountriesListPacked: _verificationConfig.forbiddenCountriesListPacked,
                ofacEnabled: _verificationConfig.ofacEnabled,
                vcAndDiscloseProof: proof
            })
        );

        // Get the old account address from the user identifier
        address oldAccount = address(uint160(result.userIdentifier));

        // Check if the old account has a recovery key set
        if (accountRecoveryKeys[oldAccount].length == 0) {
            revert KeyNotAuthorized();
        }

        // Mark nullifier as used
        _nullifiers[result.nullifier] = true;

        // Get the new account address from the revealed data
        address newAccount = address(uint160(result.revealedDataPacked[0]));

        // Transfer the recovery key to the new account
        accountRecoveryKeys[newAccount] = accountRecoveryKeys[oldAccount];
        delete accountRecoveryKeys[oldAccount];

        emit AccountRecovered(oldAccount, newAccount);
    }
}
