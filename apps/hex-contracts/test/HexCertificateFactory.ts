import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ethers, upgrades } from 'hardhat';
import { HexCertificateFactory } from '../typechain';
import { expect } from 'chai';

describe('HexCertificateFactory', () => {
  let contract: HexCertificateFactory;
  let admin: SignerWithAddress;
  let notAdmin: SignerWithAddress;

  before(async () => {
    const HexCertificateFactory = await ethers.getContractFactory(
      'HexCertificateFactory'
    );
    const proxyContract = <HexCertificateFactory>(
      await upgrades.deployProxy(HexCertificateFactory)
    );
    contract = await proxyContract.deployed();

    [admin, notAdmin] = await ethers.getSigners();
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
});
