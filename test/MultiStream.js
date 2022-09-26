const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");

  describe("MultiStream",function(){
    async function deployMultiStreamFixture(){
      const MultiStream = await ethers.getContractFactory("ERC1620");
      const multiStream = await MultiStream.deploy();
      return { multiStream };
    }

    describe("Stream Creation",function(){
        it("Should create a stream",async function(){
            const { multiStream } = await loadFixture(deployMultiStreamFixture);
            var tx = (await multiStream.createStream("0x5fbdb2315678afecb367f032d93f642f64180aa3","0x5fbdb2315678afecb367f032d93f642f64180aa3","0x5fbdb2315678afecb367f032d93f642f64180aa3",100,10,166732456));
            console.log(tx);
        });
    })

    describe("Return streams created",function(){
        it("Should return streams created",async function(){
            const { multiStream } = await loadFixture(deployMultiStreamFixture);
            var count = await multiStream.getStreams();
            console.log("Streams created: ",count.toString());
        });
    })

    describe("Return streams by Id",function(){
        it("Should return streams created",async function(){
            const { multiStream } = await loadFixture(deployMultiStreamFixture);
            var stream = await multiStream.getStreambyId(1);
            console.log("Stream : ",stream);
        });
    })

    describe("Modify Stream",function(){
        it("Should modify a stream",async function(){
            const { multiStream } = await loadFixture(deployMultiStreamFixture);
            expect(await multiStream.modifyStream(1,200,166732456));
        });
    })

  })