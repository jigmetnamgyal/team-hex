// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/// @title Hex Certificate Factory - Team Hex submission for web3con hackathon
/// @author Carlo Miguel Dy
/// @dev A university registrant and issuer of certificates via {AccessControl}
contract HexCertificateFactory is
    Initializable,
    ERC721EnumerableUpgradeable,
    AccessControlUpgradeable
{
    using Counters for Counters.Counter;
    using Strings for uint256;

    address public treasuryAddress;

    string public baseURI;

    Counters.Counter private _tokenCounter;

    Counters.Counter private _registeredUniversityCounter;

    /**
     * @dev Holds all records of registered universities.
     */
    mapping(bytes32 => RegisteredUniveristy) private _idToUniversity;

    /**
     * @dev Keeps track of the registrant with universityId.
     */
    mapping(address => bytes32) private _registrantToUniversityId;

    /**
     * @dev Keeps track of `universityId` by gradually incrementing index.
     */
    mapping(uint256 => bytes32) private _indexToUniversityId;

    // Optional mapping for token URIs
    mapping(uint256 => string) private _tokenURIs;

    struct RegisteredUniveristy {
        bytes32 universityId;
        address registrant;
        uint256 index;
        uint256 registeredAt;
        string directory;
        bool exists;
    }

    /**
     * @dev Emits when the `treasuryAddress` gets updated.
     */
    event TreasuryAddressUpdated(
        address indexed oldTreasuryAddress,
        address indexed newTreasuryAddress
    );

    /**
     * @dev Emits when the `baseURI` gets updated.
     */
    event BaseURIUpdated(string indexed oldBaseURI, string indexed newBaseURI);

    /**
     * @dev Emits when a certificate is issued to a `recipient`.
     */
    event CertificateIssued(
        address indexed recipient,
        bytes32 indexed universityId,
        uint256 indexed tokenId
    );

    /**
     * @dev Emits when a new university gets registered.
     */
    event UniversityRegistered(
        bytes32 indexed universityId,
        address indexed registrant,
        address indexed caller
    );

    /**
     * @dev Emits when a registed university gets their permissions revoked to issue certificates.
     */
    event UniversityDeregistered(
        bytes32 indexed universityId,
        address indexed registrant,
        address indexed caller
    );

    /**
     * @dev Emits when a registrant is updated of a registered university.
     */
    event UniversityRegistrantChanged(
        bytes32 indexed universityId,
        address indexed oldRegistrant,
        address indexed newRegistrant
    );

    /**
     * @dev Emits when a university directory gets updated.
     */
    event UniversityDirectoryUpdated(
        bytes32 indexed universityId,
        string oldDirectory,
        string newDirectory
    );

    /**
     * @dev Emits when an existing token updates their tokenURI.
     */
    event TokenURIUpdated(
        uint256 indexed tokenId,
        string indexed oldDirectory,
        string indexed newDirectory
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

    /**
     * @dev Validates for the revoke/restore methods for a registered university
     * @param universityId The unique identifier for a university
     * @param registrant The address that is authorized to university minting
     */
    modifier revokeRestoreValidation(bytes32 universityId, address registrant) {
        require(
            _idToUniversity[universityId].registrant == registrant,
            "The provided registrant does not match with the registrant on provided universityId."
        );
        require(
            _idToUniversity[universityId].exists == true,
            "The university isn't registered."
        );
        _;
    }

    /**
     * @dev Validates if the given address is not an empty address.
     */
    modifier validAddress(address _address) {
        require(_address != address(0), "The given address must not be empty.");
        _;
    }

    /**
     * @dev A guard to prevent withdrawals when a treasuryAddress has not been set.
     */
    modifier treasuryNotEmpty() {
        require(
            treasuryAddress != address(0),
            "The treasuryAddress is empty, it must be set first."
        );
        _;
    }

    function initialize(string memory _storageBaseURI) public initializer {
        __ERC721_init("Hex Certificate Factory", "HCF");
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);

        baseURI = _storageBaseURI;
    }

    /**
     * @dev Withdraws the amount of native crypto received to the `treasuryAddress`
     */
    function withdraw() external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(
            treasuryAddress != address(0),
            "The treasuryAddress is empty, it must be set first."
        );

        payable(treasuryAddress).transfer(address(this).balance);
    }

    /**
     * @dev Withdraws the amount of ERC20 token received to the `treasuryAddress`
     */
    function withdrawERC20(address tokenAddress)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
        treasuryNotEmpty
    {
        IERC20 tokenContract = IERC20(tokenAddress);

        tokenContract.transfer(
            treasuryAddress,
            tokenContract.balanceOf(address(this))
        );
    }

    /**
     * @dev Withdraws a specific ERC721 tokenId received to the `treasuryAddress`
     */
    function withdrawERC721(address tokenAddress, uint256 tokenId)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
        treasuryNotEmpty
    {
        IERC721 tokenContract = IERC721(tokenAddress);

        tokenContract.transferFrom(address(this), treasuryAddress, tokenId);
    }

    /**
     * @dev Returns the total count of registered universities.
     */
    function getUniversityCount() external view returns (uint256) {
        return _registeredUniversityCounter.current();
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
     * @dev Returns a universityId by index.
     */
    function getUniversityIdByIndex(uint256 index)
        external
        view
        returns (bytes32)
    {
        return _indexToUniversityId[index];
    }

    /**
     * @dev Gives a university permissions to issue certificates to their students
     * @param universityId The identifier that represents a university
     * @param registrant The address that registers a university
     * @param directory The directory name for the university metadata certificates are stored
     */
    function authorizeUniversity(
        bytes32 universityId,
        address registrant,
        string memory directory
    )
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

        uint256 registeredUniversityIndex = _registeredUniversityCounter
            .current();
        _registeredUniversityCounter.increment();
        _indexToUniversityId[registeredUniversityIndex] = universityId;

        _grantRole(universityId, registrant);
        _registrantToUniversityId[registrant] = universityId;
        _idToUniversity[universityId] = RegisteredUniveristy({
            universityId: universityId,
            registrant: registrant,
            index: registeredUniversityIndex,
            registeredAt: block.timestamp,
            directory: directory,
            exists: true
        });

        emit UniversityRegistered(universityId, registrant, msg.sender);
    }

    /**
     * @dev Updates the registrant of a university
     * @param universityId The identifier that represents a university
     * @param newRegistrant Replaces the existing registrant
     */
    function changeUniversityRegistrant(
        bytes32 universityId,
        address newRegistrant
    )
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
        validUniversityParams(universityId, newRegistrant)
    {
        require(
            _registrantToUniversityId[newRegistrant] == bytes32(0),
            "The new registrant should not have an existing university registered."
        );
        require(
            _idToUniversity[universityId].exists == true,
            "No registered university with the provided universityId."
        );
        require(
            _idToUniversity[universityId].registrant != newRegistrant,
            "Unable to update with the same registrant."
        );

        emit UniversityRegistrantChanged(
            universityId,
            _idToUniversity[universityId].registrant,
            newRegistrant
        );

        _revokeRole(universityId, _idToUniversity[universityId].registrant);
        _grantRole(universityId, newRegistrant);

        // detach the universityId from the previous registrant
        _registrantToUniversityId[
            _idToUniversity[universityId].registrant
        ] = bytes32(0);

        // attach the new registrant to the existing universityId
        _registrantToUniversityId[newRegistrant] = universityId;

        // updates the registrant from the mapping `_idToUniversity`
        _idToUniversity[universityId].registrant = newRegistrant;
    }

    /**
     * @dev Removes the permissions of a university for issuing certificates to students
     * @param universityId The identifier that represents a university
     * @param registrant The address that registers a university
     */
    function revokeUniversityAuthorization(
        bytes32 universityId,
        address registrant
    )
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
        validUniversityParams(universityId, registrant)
        revokeRestoreValidation(universityId, registrant)
    {
        _revokeRole(universityId, registrant);

        emit UniversityDeregistered(universityId, registrant, msg.sender);
    }

    /**
     * @dev Restores the permissions of a university for issuing certificates to students
     * @param universityId The identifier that represents a university
     * @param registrant The address that registers a university
     */
    function restoreUniversityAuthorization(
        bytes32 universityId,
        address registrant
    )
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
        validUniversityParams(universityId, registrant)
        revokeRestoreValidation(universityId, registrant)
    {
        _grantRole(universityId, registrant);

        emit UniversityDeregistered(universityId, registrant, msg.sender);
    }

    /**
     * @dev Sets a new baseURI.
     */
    function setBaseURI(string memory newBaseURI)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        emit BaseURIUpdated(baseURI, newBaseURI);

        baseURI = newBaseURI;
    }

    /**
     * @dev Updates the directory for an existing token.
     */
    function setTokenURI(uint256 tokenId, string memory newDirectory)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        emit TokenURIUpdated(tokenId, _tokenURIs[tokenId], newDirectory);

        _setTokenURI(tokenId, newDirectory);
    }

    /**
     * @param _treasuryAddress A new server address value
     * @dev Sets a new value to `treasuryAddress` state property
     */
    function setTreasuryAddress(address _treasuryAddress)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
        validAddress(_treasuryAddress)
    {
        emit TreasuryAddressUpdated(treasuryAddress, _treasuryAddress);

        treasuryAddress = _treasuryAddress;
    }

    /**
     * @dev Updates the directory name for a specific registered university
     * @param universityId The identifier that represents a registered university
     * @param directory The new baseURI for a university
     */
    function setUniversityDirectory(
        bytes32 universityId,
        string memory directory
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        emit UniversityDirectoryUpdated(
            universityId,
            _idToUniversity[universityId].directory,
            directory
        );

        _idToUniversity[universityId].directory = directory;
    }

    /**
     * @dev See {IERC721Metadata-tokenURI}.
     *
     * The implementation of this method was taken from {ERC721URIStorage} but
     * made tweakings as necessary to the use case.
     */
    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721URIStorage: URI query for nonexistent token"
        );

        string memory _tokenURI = _tokenURIs[tokenId];
        string memory base = _baseURI();

        // If there is no base URI, return the token URI.
        if (bytes(base).length == 0) {
            return _tokenURI;
        }

        // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
        if (bytes(_tokenURI).length > 0) {
            return
                string(
                    abi.encodePacked(
                        base,
                        _tokenURI,
                        tokenId.toString(),
                        ".json"
                    )
                );
        }

        return super.tokenURI(tokenId);
    }

    /**
     * @dev When a university is KYC verified, then it can authorized minting certificates.
     * @param universityId The registered university
     * @param recipient The address that will receive the minted NFT
     */
    function issueCertificate(bytes32 universityId, address recipient)
        external
        onlyRole(universityId)
    {
        require(
            hasRole(universityId, msg.sender),
            "Not authorized to issue certificates."
        );

        _tokenCounter.increment();
        uint256 tokenId = _tokenCounter.current();
        _safeMint(recipient, tokenId);
        _setTokenURI(tokenId, _idToUniversity[universityId].directory);

        emit CertificateIssued(recipient, universityId, tokenId);
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721EnumerableUpgradeable, AccessControlUpgradeable)
        returns (bool)
    {
        bool erc721Enumerable = interfaceId ==
            type(IERC721EnumerableUpgradeable).interfaceId ||
            super.supportsInterface(interfaceId);

        bool accessControl = interfaceId ==
            type(IAccessControlUpgradeable).interfaceId ||
            super.supportsInterface(interfaceId);

        return erc721Enumerable || accessControl;
    }

    /**
     * @dev Sets `_tokenURI` as the tokenURI of `tokenId`.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function _setTokenURI(uint256 tokenId, string memory _tokenURI)
        internal
        virtual
    {
        require(
            _exists(tokenId),
            "ERC721URIStorage: URI set of nonexistent token"
        );
        _tokenURIs[tokenId] = _tokenURI;
    }

    /**
     * @inheritdoc ERC721Upgradeable
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    /**
     * @dev Destroys `tokenId`.
     * The approval is cleared when the token is burned.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     *
     * Emits a {Transfer} event.
     */
    function _burn(uint256 tokenId) internal virtual override {
        super._burn(tokenId);

        if (bytes(_tokenURIs[tokenId]).length != 0) {
            delete _tokenURIs[tokenId];
        }
    }
}
