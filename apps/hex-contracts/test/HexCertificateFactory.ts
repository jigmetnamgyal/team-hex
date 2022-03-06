import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ethers, upgrades } from 'hardhat';
import { HexCertificateFactory } from '../typechain';

describe('HexCertificateFactory', () => {
  let contract: HexCertificateFactory;
  let deployer: SignerWithAddress;
  let caller: SignerWithAddress;

  before(async () => {
    const HexCertificateFactory = await ethers.getContractFactory(
      'HexCertificateFactory'
    );
    const proxyContract = <HexCertificateFactory>(
      await upgrades.deployProxy(HexCertificateFactory)
    );
    contract = await proxyContract.deployed();

    [deployer, caller] = await ethers.getSigners();
  });

  describe('setBaseURI', () => {
    it('should only allow admin to mutate baseURI', async () => {
      await contract.setBaseURI('ipfs://cid_123/');
    });
  });
});
