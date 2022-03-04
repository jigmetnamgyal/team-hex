// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract CertificateFactory is ERC721A, AccessControl {
    address public serverAddress;

    mapping(bytes32 => RegisteredUniveristy) private _idToUniversity;

    mapping(address => bytes32) private _registrantToUniversityId;

    struct RegisteredUniveristy {
        bytes32 universityId;
        address registrant;
        uint256 registeredAt;
        bool exists;
    }

    event ServerAddressUpdated(
        address indexed oldServerAddress,
        address indexed newServerAddress
    );

    event CertificateIssued(
        address indexed receiver,
        string indexed universityId,
        uint256 indexed tokenId
    );

    event UniversityRegistered(
        bytes32 indexed universityId,
        address indexed registrant,
        address indexed caller
    );

    event UniversityDeregistered(
        bytes32 indexed universityId,
        address indexed registrant,
        address indexed caller
    );

    /**
     * @dev Validates if the given params for university transactions are valid
     * @param universityId The unique identifier for a university
     * @param registrant The address that is authorized to university minting
     */
    modifier validUniversityParams(bytes32 universityId, address registrant) {
        require(
            universityId != bytes32(0),
            "The given universityId should not be empty."
        );
        require(
            registrant != address(0),
            "The registrant should not be an empty address."
        );
        _;
    }

    constructor() ERC721A("Certificate Factory", "CF") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /**
     * @dev Get the university value by the given `id` param
     * @param universityId The unique identifier for a university
     */
    function getUniversity(bytes32 universityId)
        external
        view
        returns (RegisteredUniveristy memory)
    {
        return _idToUniversity[universityId];
    }

    /**
     * @dev Get the `universityId` by the given `registrant` param
     * @param registrant The address that has a university registered
     */
    function getUniversityId(address registrant)
        external
        view
        returns (bytes32)
    {
        return _registrantToUniversityId[registrant];
    }

    /**
     * @dev When a university is registered, gives them the authorization to issue certificates to students
     * @param universityId The identifier that represents a university
     * @param registrant The address that registers a university
     */
    function registerUniversity(bytes32 universityId, address registrant)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
        validUniversityParams(universityId, registrant)
    {
        require(
            _idToUniversity[universityId].exists == false,
            "The given universityId was already registered."
        );
        require(
            _registrantToUniversityId[registrant] == bytes32(0),
            "The registrant has already registered a university."
        );

        _grantRole(universityId, registrant);
        _registrantToUniversityId[registrant] = universityId;
        _idToUniversity[universityId] = RegisteredUniveristy({
            universityId: universityId,
            registrant: registrant,
            registeredAt: block.timestamp,
            exists: true
        });

        emit UniversityRegistered(universityId, registrant, msg.sender);
    }

    /**
     * @dev Removes the authorization of a university for issuing certificates to students
     * @param universityId The identifier that represents a university
     * @param registrant The address that registers a university
     */
    function deregisterUniversity(bytes32 universityId, address registrant)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
        validUniversityParams(universityId, registrant)
    {
        require(
            _idToUniversity[universityId].registrant == registrant,
            "The given registrant to a registered university registrant is unmatched."
        );
        require(
            _idToUniversity[universityId].exists == true,
            "The university isn't registered."
        );

        _revokeRole(universityId, registrant);

        emit UniversityDeregistered(universityId, registrant, msg.sender);
    }

    /**
     * @param _serverAddress A new server address value
     * @dev Sets a new value to `serverAddress` state property
     */
    function setServerAddress(address _serverAddress)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        emit ServerAddressUpdated(serverAddress, _serverAddress);

        serverAddress = _serverAddress;
    }

    /**
     * @dev Determines if the given signature is signed by `serverAddress`
     * @param digest The abi encoded packed values for `sender` and `universityId`
     * @param signature The generated address by the `serverAddress`
     */
    function validSignature(bytes32 digest, bytes memory signature)
        public
        view
        returns (bool)
    {
        return ECDSA.recover(digest, signature) == (serverAddress);
    }

    /**
     * @dev When a university is KYC verified, then it can authorized minting certificates.
     * @param universityId The registered university
     * @param signature The generated signature by the `serverAddress`
     */
    function issueCertificate(
        string memory universityId,
        bytes memory signature,
        address receiver
    ) external {
        require(
            validSignature(hashIdentifier(receiver, universityId), signature),
            "Invalid signature."
        );

        _safeMint(receiver, 1);

        emit CertificateIssued(receiver, universityId, _currentIndex);
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721A, AccessControl)
        returns (bool)
    {
        bool erc721a = interfaceId == type(IERC721).interfaceId ||
            interfaceId == type(IERC721Metadata).interfaceId ||
            super.supportsInterface(interfaceId);

        bool accessControl = interfaceId == type(IAccessControl).interfaceId ||
            super.supportsInterface(interfaceId);

        return erc721a || accessControl;
    }

    /**
     * @dev The token counter starts at 1
     */
    function _startTokenId() internal view virtual override returns (uint256) {
        return 1;
    }

    /**
     * @dev Packs and hashes both the `receiver` and the `universityId` params
     * @param receiver The receiver of the certificate
     * @param universityId The identifier that represents a registered university
     */
    function hashIdentifier(address receiver, string memory universityId)
        private
        pure
        returns (bytes32)
    {
        bytes32 digest = keccak256(abi.encodePacked(receiver, universityId));

        return ECDSA.toEthSignedMessageHash(digest);
    }
}
