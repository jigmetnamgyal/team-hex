// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/// @title Hex Certificate Factory
/// @author Carlo Miguel Dy
/// @dev A university registrant and issuer of certificates via {AccessControl}
contract HexCertificateFactory is ERC721Enumerable, AccessControl {
    using Counters for Counters.Counter;
    using Strings for uint256;

    address public serverAddress;

    address public treasuryAddress;

    string public baseURI = "";

    Counters.Counter private _tokenCounter;

    Counters.Counter private _registeredUniversityCounter;

    mapping(bytes32 => RegisteredUniveristy) private _idToUniversity;

    mapping(address => bytes32) private _registrantToUniversityId;

    mapping(uint256 => bytes32) private _indexToUniversityId;

    // Optional mapping for token URIs
    mapping(uint256 => string) private _tokenURIs;

    struct RegisteredUniveristy {
        bytes32 universityId;
        address registrant;
        uint256 index;
        uint256 registeredAt;
        string universityBaseURI;
        bool exists;
    }

    event ServerAddressUpdated(
        address indexed oldServerAddress,
        address indexed newServerAddress
    );

    event TreasuryAddressUpdated(
        address indexed oldTreasuryAddress,
        address indexed newTreasuryAddress
    );

    event BaseURIUpdated(string indexed oldBaseURI, string indexed newBaseURI);

    event CertificateIssued(
        address indexed receiver,
        bytes32 indexed universityId,
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

    event UniversityRegistrantChanged(
        bytes32 indexed universityId,
        address indexed oldRegistrant,
        address indexed newRegistrant
    );

    event UniversityBaseURIUpdated(
        bytes32 indexed universityId,
        string oldBaseURI,
        string newBaseURI
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

    constructor() ERC721("Hex Certificate Factory", "HCF") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
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
     * @param universityBaseURI The baseURI for the certificate the university is issuing
     */
    function authorizeUniversity(
        bytes32 universityId,
        address registrant,
        string memory universityBaseURI
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
            universityBaseURI: universityBaseURI,
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
        emit UniversityRegistrantChanged(
            universityId,
            _idToUniversity[universityId].registrant,
            newRegistrant
        );

        _revokeRole(universityId, _idToUniversity[universityId].registrant);
        _grantRole(universityId, newRegistrant);
        _idToUniversity[universityId].registrant = newRegistrant;
    }

    /**
     * @dev Removes the permissions of a university for issuing certificates to students
     * @param universityId The identifier that represents a university
     * @param registrant The address that registers a university
     */
    function revokeUniversity(bytes32 universityId, address registrant)
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
     * @param _serverAddress A new server address value
     * @dev Sets a new value to `serverAddress` state property
     */
    function setServerAddress(address _serverAddress)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
        validAddress(_serverAddress)
    {
        emit ServerAddressUpdated(serverAddress, _serverAddress);

        serverAddress = _serverAddress;
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
     * @dev Updates the baseURI for a specific registered university
     * @param universityId The identifier that represents a registered university
     * @param newBaseURI The new baseURI for a university
     */
    function setUniversityBaseURI(
        bytes32 universityId,
        string memory newBaseURI
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        emit UniversityBaseURIUpdated(
            universityId,
            _idToUniversity[universityId].universityBaseURI,
            newBaseURI
        );

        _idToUniversity[universityId].universityBaseURI = newBaseURI;
    }

    /**
     * @dev See {IERC721Metadata-tokenURI}.
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
                string(abi.encodePacked(base, _tokenURI, tokenId.toString()));
        }

        return super.tokenURI(tokenId);
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
     */
    function issueCertificate(bytes32 universityId, address receiver)
        external
        onlyRole(universityId)
    {
        require(
            hasRole(universityId, msg.sender),
            "Not authorized to issue certificates."
        );

        _tokenCounter.increment();
        uint256 tokenId = _tokenCounter.current();
        _safeMint(receiver, tokenId);
        _setTokenURI(tokenId, _idToUniversity[universityId].universityBaseURI);

        emit CertificateIssued(receiver, universityId, tokenId);
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721Enumerable, AccessControl)
        returns (bool)
    {
        bool erc721Enumerable = interfaceId ==
            type(IERC721Enumerable).interfaceId ||
            super.supportsInterface(interfaceId);
        bool accessControl = interfaceId == type(IAccessControl).interfaceId ||
            super.supportsInterface(interfaceId);
        return erc721Enumerable || accessControl;
    }

    /**
     * @dev Packs and hashes both the `receiver` and the `universityId` params
     * @param receiver The receiver of the certificate
     * @param universityId The identifier that represents a registered university
     */
    function _hashIdentifier(address receiver, bytes32 universityId)
        private
        pure
        returns (bytes32)
    {
        bytes32 digest = keccak256(abi.encodePacked(receiver, universityId));

        return ECDSA.toEthSignedMessageHash(digest);
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
     * @inheritdoc ERC721
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
