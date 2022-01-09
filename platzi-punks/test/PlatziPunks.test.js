const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PlatziPunks", function () {

  const setup = async (maxSupply = 10000) => {
    const [ owner ] = await ethers.getSigners();
    const PlatziPunks = await ethers.getContractFactory("PlatziPunks");
    const deployed = await PlatziPunks.deploy(maxSupply);

    return {
      owner,
      deployed
    }
  };

  describe("Deployment", () => {
    it("Defines the max supply", async () => {
      const maxSupply = 100;

      const { deployed } = await setup(maxSupply);

      const deployedMaxSupply = await deployed.maxSupply();
      expect(deployedMaxSupply).to.equal(maxSupply);
    });
  });
    
  describe("Minting", () => {
    it("Mint a new token and assigns it to owner",  async () => {
      const { owner, deployed } = await setup();

      await deployed.mint();

      const minterOwner = await deployed.ownerOf(0);
      expect(minterOwner).to.equals(owner.address);
    });

    it("Has a minting limit", async () => {
      const maxSupply = 2;

      const { deployed } = await setup(maxSupply);
      
      await Promise.all([deployed.mint(), deployed.mint()]);
      await expect(deployed.mint()).to.be.revertedWith("No more PlatziPunks left");
    });
  });

  describe("TokenURI", () => {
    it("returns valid metadata",  async () => {
      const { owner, deployed } = await setup();

      await deployed.mint();

      const tokenURI = await deployed.tokenURI(0);
      const stringifiedTokenURI = await tokenURI.toString();
      const [prefix, base64JSON] = stringifiedTokenURI.split("data:application/json;base64,");
      const stringifiedMetadata = await Buffer.from(base64JSON, "base64").toString("ascii");
      const metadata = JSON.parse(stringifiedMetadata);

      expect(metadata).to.have.all.keys("name", "description", "image");
    });
  });

});
