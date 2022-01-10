const deploy = async () => {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contract using account:", deployer.address)

    const PlatziPunks = await ethers.getContractFactory("PlatziPunks");
    const deployed = await PlatziPunks.deploy(100);

    console.log("Platzi Punks is deployed at:", deployed.address);
}

deploy()
    .then(() => process.exit(0))
    .catch((err) => {
        console.log(err);
        process.exit(1);
    })