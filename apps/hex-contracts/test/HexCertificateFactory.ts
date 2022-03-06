import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ethers, upgrades } from 'hardhat';
import { HexCertificateFactory } from '../typechain';
import { expect } from 'chai';
import { BigNumber } from 'ethers';

describe('HexCertificateFactory', () => {
  const DEFAULT_ADMIN_ROLE =
    '0x0000000000000000000000000000000000000000000000000000000000000000';

  let contract: HexCertificateFactory;
  let admin: SignerWithAddress;
  let notAdmin: SignerWithAddress;
  let registrant1: SignerWithAddress;
  let registrant2: SignerWithAddress;
  let certificateReceiver1: SignerWithAddress;
  let certificateReceiver2: SignerWithAddress;
  let baseURI: string;

  before(async () => {
    const HexCertificateFactory = await ethers.getContractFactory(
      'HexCertificateFactory'
    );
    const proxyContract = <HexCertificateFactory>await upgrades.deployProxy(
      HexCertificateFactory,
      [
        'https://web3con-team-hex.s3.filebase.com/', // baseURI or storageBaseURI constructor argument
      ]
    );
    contract = await proxyContract.deployed();

    [
      admin,
      notAdmin,
      registrant1,
      registrant2,
      certificateReceiver1,
      certificateReceiver2,
    ] = await ethers.getSigners();

    baseURI = await contract.baseURI();
  });

  // simple test cases
  describe('setBaseURI', () => {
    it('should only allow admin to mutate baseURI', async () => {
      contract = contract.connect(admin);

      await contract.setBaseURI(baseURI);
    });

    it('should revert when caller is not admin', async () => {
      contract = contract.connect(notAdmin);

      expect(contract.setBaseURI(baseURI)).to.be.reverted;
    });
  });

  describe('authorizeUniversity', () => {
    it('should add a university when caller is admin', async () => {
      contract = contract.connect(admin);
      const hashedUniversityId = ethers.utils.solidityKeccak256(
        ['string'], // since it is a string, then we hash it into bytes32 as a result
        ['NEW_UNIVERSITY_ID'] // this can be anything, maybe generated from PostgreSQL UUID
      );
      const payload = {
        universityId: hashedUniversityId,
        directory: `${hashedUniversityId}/`,
      };

      // when a university passes KYC verifiction then
      // adds a registered university on-chain
      await expect(
        contract.authorizeUniversity(
          payload.universityId,
          registrant1.address,
          payload.directory
        )
      )
        .to.emit(contract, 'UniversityRegistered')
        .withArgs(payload.universityId, registrant1.address, admin.address);

      const universityId = await contract.getUniversityId(registrant1.address);
      expect(universityId).to.be.equal(payload.universityId);
      console.log({ universityId });

      const universityCount = await contract.getUniversityCount();
      expect(universityCount.toNumber()).to.be.equal(1);

      const _universityId = await contract.getUniversityIdByIndex(
        BigNumber.from(0) // index 0 since it is the first university added
      );
      expect(_universityId).to.be.equal(payload.universityId);

      // assertions on the RegisteredUniverstiy struct
      const university = await contract.getUniversity(universityId);
      expect(university.exists).to.be.equal(true);
      expect(university.registrant).to.be.equal(registrant1.address);
      expect(university.index.toNumber()).to.be.equal(0); // assert if it still equal to 0
      expect(university.directory).to.be.equal(payload.directory);
    });

    it('should revert when caller is not admin', async () => {
      contract = contract.connect(notAdmin);
      const hashedUniversityId = ethers.utils.solidityKeccak256(
        ['string'], // since it is a string, then we hash it into bytes32 as a result
        ['NEW_UNIVERSITY_ID'] // this can be anything, maybe generated from PostgreSQL UUID
      );
      const payload = {
        universityId: hashedUniversityId,
        directory: `${hashedUniversityId}/`,
      };

      // when a university passes KYC verifiction then
      // adds a registered university on-chain
      await expect(
        contract.authorizeUniversity(
          payload.universityId,
          registrant1.address,
          payload.directory
        )
      ).to.be.revertedWith(
        `AccessControl: account ${notAdmin.address.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE}`
      );
    });
  });

  describe('issueCertificate', () => {
    it('should issue certificates to target addresses when caller is a registered', async () => {
      contract = contract.connect(registrant1);
      const tokenId = BigNumber.from(1); // suppose that the first mint is always tokenId 1

      const universityId = await contract.getUniversityId(registrant1.address);
      await expect(
        contract.issueCertificate(universityId, certificateReceiver1.address)
      ).to.be.not.and.to.be.not.revertedWith(
        'Not authorized to issue certificates.'
      );

      const totalSupply = await contract.totalSupply();
      expect(totalSupply.toNumber()).to.be.eq(1);

      const [university] = await Promise.all([
        contract.getUniversity(universityId),
      ]);
      const universityDirectory = university.directory;
      const [
        certificateReceiverBalance,
        certificateReceiverTokenURI,
        tokenOwner,
      ] = await Promise.all([
        contract.balanceOf(certificateReceiver1.address),
        contract.tokenURI(tokenId),
        contract.ownerOf(tokenId),
      ]);

      console.log({ certificateReceiverTokenURI });

      expect(certificateReceiverBalance.toNumber()).to.be.eq(1);
      expect(certificateReceiverTokenURI).to.be.equal(
        [baseURI, universityDirectory, tokenId.toNumber(), '.json'].join('')
      );
      expect(tokenOwner).to.be.eq(certificateReceiver1.address);
    });
  });
});
