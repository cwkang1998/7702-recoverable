// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {SelfVerificationRoot} from "self/contracts/contracts/abstract/SelfVerificationRoot.sol";
import {ISelfVerificationRoot} from "self/contracts/contracts/interfaces/ISelfVerificationRoot.sol";
import {IVcAndDiscloseCircuitVerifier} from "self/contracts/contracts/interfaces/IVcAndDiscloseCircuitVerifier.sol";
import {IIdentityVerificationHubV1} from "self/contracts/contracts/interfaces/IIdentityVerificationHubV1.sol";
import {CircuitConstants} from "self/contracts/contracts/constants/CircuitConstants.sol";
import {Ownable} from "solady/auth/Ownable.sol";
import {ExperimentDelegation} from "../ExperimentDelegation.sol";

/// @title Recovery
/// @notice Contract for managing account recovery using selfxyz's proof and nullifier systemclear
contract Recovery is SelfVerificationRoot, Ownable {
    ////////////////////////////////////////////////////////////////////////
    // Storage
    ////////////////////////////////////////////////////////////////////////

    /// @notice Mapping from nullifier to their account addresses
    mapping(uint256 => address) public nullifierToAccountMapping;

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

    error RegisteredNullifier();

    error AccountNotFound();

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

        // Get the new account address from the revealed data
        address accountAddress = nullifierToAccountMapping[result.nullifier];
        if (accountAddress == address(0)) {
            revert AccountNotFound();
        }

        ExperimentDelegation(accountAddress).set()

        address newAccount = address(uint160(result.revealedDataPacked[0]));

        // Transfer the recovery key to the new account
        accountRecoveryKeys[newAccount] = accountRecoveryKeys[oldAccount];
        delete accountRecoveryKeys[oldAccount];

        emit AccountRecovered(oldAccount, newAccount);
    }
}
