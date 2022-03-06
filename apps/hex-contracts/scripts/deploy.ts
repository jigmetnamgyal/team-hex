import { ethers, upgrades } from 'hardhat';
import { HexCertificateFactory } from '../typechain';

async function main() {
  const HexCertificateFactory = await ethers.getContractFactory(
    'HexCertificateFactory'
  );
  const proxyContract = <HexCertificateFactory>await upgrades.deployProxy(
    HexCertificateFactory,
    [
      'https://web3con-team-hex.s3.filebase.com/', // baseURI or storageBaseURI constructor argument
    ]
  );
  const contract = await proxyContract.deployed();

  console.log('HexCertificateFactory deployed to:', contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
