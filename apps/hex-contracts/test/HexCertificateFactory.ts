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
  let registrant3: SignerWithAddress;
  let registrant4: SignerWithAddress;

  before(async () => {
    const HexCertificateFactory = await ethers.getContractFactory(
      'HexCertificateFactory'
    );
    const proxyContract = <HexCertificateFactory>(
      await upgrades.deployProxy(HexCertificateFactory)
    );
    contract = await proxyContract.deployed();

    [admin, notAdmin, registrant1, registrant2, registrant3, registrant4] =
      await ethers.getSigners();
  });

  // simple test cases
  describe('setBaseURI', () => {
    it('should only allow admin to mutate baseURI', async () => {
      contract = contract.connect(admin);

      await contract.setBaseURI('ipfs://cid_123/');
    });

    it('should revert when caller is not admin', async () => {
      contract = contract.connect(notAdmin);

      expect(contract.setBaseURI('ipfs://cid_123/')).to.be.reverted;
    });
  });

  describe('authorizeUniversity', () => {
    it('should add a university when caller is admin', async () => {
      contract = contract.connect(admin);
      const payload = {
        universityId: ethers.utils.solidityKeccak256(
          ['string'], // since it is a string, then we hash it into bytes32 as a result
          ['NEW_UNIVERSITY_ID'] // this can be anything, maybe generated from PostgreSQL UUID
        ),
        universityBaseURI: 'ipfs://cid_university_123/',
      };

      // when a university passes KYC verifiction then
      // adds a registered university on-chain
      await expect(
        contract.authorizeUniversity(
          payload.universityId,
          registrant1.address,
          payload.universityBaseURI
        )
      )
        .to.emit(contract, 'UniversityRegistered')
        .withArgs(payload.universityId, registrant1.address, admin.address);

      const universityId = await contract.getUniversityId(registrant1.address);
      expect(universityId).to.be.equal(payload.universityId);

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
      expect(university.universityBaseURI).to.be.equal(
        payload.universityBaseURI
      );
    });

    it('should revert when caller is not admin', async () => {
      contract = contract.connect(notAdmin);
      const hash = ethers.utils.solidityKeccak256(
        ['string'],
        ['NEW_UNIVERSITY_ID']
      );
      const universityBaseURI = 'ipfs://cid_university_123/';

      await expect(
        contract.authorizeUniversity(
          hash,
          registrant1.address,
          universityBaseURI
        )
      ).to.be.revertedWith(
        `AccessControl: account ${notAdmin.address.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE}`
      );
    });
  });
});
