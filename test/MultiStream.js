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
      await multiStream.createStream("0x5fbdb2315678afecb367f032d93f642f64180aa3","0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266","0x5fbdb2315678afecb367f032d93f642f64180aa3",100,10,166732456);
      return { multiStream };
    }

    describe("Stream Creation",function(){
        it("Should create a stream",async function(){
            const { multiStream } = await loadFixture(deployMultiStreamFixture);
            var tx = (await multiStream.createStream("0x5fbdb2315678afecb367f032d93f642f64180aa3","0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266","0x5fbdb2315678afecb367f032d93f642f64180aa3",100,10,166732456));
        });
        it("Should not create a stream with a zero address",async function(){
            const { multiStream } = await loadFixture(deployMultiStreamFixture);
            await expect(multiStream.createStream("0x0000000000000000000000000000000000000000","0x5fbdb2315678afecb367f032d93f642f64180aa3","0x5fbdb2315678afecb367f032d93f642f64180aa3",100,10,166732456)).to.be.revertedWith("MultiStream: Zero Address").rejected;
        });

        it("Should not create a stream with a zero amount",async function(){
            const { multiStream } = await loadFixture(deployMultiStreamFixture);
            await expect(multiStream.createStream("0x5fbdb2315678afecb367f032d93f642f64180aa3","0x5fbdb2315678afecb367f032d93f642f64180aa3","0x5fbdb2315678afecb367f032d93f642f64180aa3",0,10,166732456)).to.be.revertedWith("MultiStream: Zero Amount").rejected;
        });

        it("Should not create a stream with a zero frequency",async function(){
            const { multiStream } = await loadFixture(deployMultiStreamFixture);
            await expect(multiStream.createStream("0x5fbdb2315678afecb367f032d93f642f64180aa3","0x5fbdb2315678afecb367f032d93f642f64180aa3","0x5fbdb2315678afecb367f032d93f642f64180aa3",100,0,166732456)).to.be.revertedWith("MultiStream: Zero Frequency").rejected;
        });

        it("Should not create a stream with a zero start time",async function(){
            const { multiStream } = await loadFixture(deployMultiStreamFixture);
            await expect(multiStream.createStream("0x5fbdb2315678afecb367f032d93f642f64180aa3","0x5fbdb2315678afecb367f032d93f642f64180aa3","0x5fbdb2315678afecb367f032d93f642f64180aa3",100,10,0)).to.be.revertedWith("MultiStream: Zero Start Time").rejected;
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
        it("Should return stream details by streamid",async function(){
            const { multiStream } = await loadFixture(deployMultiStreamFixture);
            var stream = await multiStream.getStreambyId(1);
        });
    })

    describe("Modify Stream",function(){
        it("Should modify a stream",async function(){
            const { multiStream } = await loadFixture(deployMultiStreamFixture);
            expect(await multiStream.modifyStream(1,200,166732456));
        });

        it("Should not modify a stream with a zero amount",async function(){
            const { multiStream } = await loadFixture(deployMultiStreamFixture);
            await expect(multiStream.modifyStream(1,0,166732456)).to.be.revertedWith("MultiStream: Zero Amount").rejected;
        });

        it("Should not modify a stream with a zero start time",async function(){
            const { multiStream } = await loadFixture(deployMultiStreamFixture);
            await expect(multiStream.modifyStream(1,200,0)).to.be.revertedWith("MultiStream: Zero Start Time").rejected;
        });

        it("Should not modify a stream with a zero stream id",async function(){
            const { multiStream } = await loadFixture(deployMultiStreamFixture);
            await expect(multiStream.modifyStream(0,200,166732456)).to.be.revertedWith("MultiStream: Zero Stream Id").rejected;
        });

        it("Should not modify a stream with a non-existent stream id",async function(){
            const { multiStream } = await loadFixture(deployMultiStreamFixture);
            await expect(multiStream.modifyStream(2,200,166732456)).to.be.revertedWith("MultiStream: Stream does not exist").rejected;
        });
    })

    describe("Check Net Flow Rate",function(){
        it("Should return positive inflow rate",async function(){
            const { multiStream } = await loadFixture(deployMultiStreamFixture);
            await multiStream.createStream("0x5fbdb2315678afecb367f032d93f642f64180aa3","0x70997970C51812dc3A010C7d01b50e0d17dc79C8","0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",100,15,166732456);
            var flowRate = await multiStream.getNetFlowRate("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266");
            expect(flowRate.Inflow - flowRate.Outflow).to.be.gt(0);
        })

        it("Should return negative inflow rate",async function(){
            const { multiStream } = await loadFixture(deployMultiStreamFixture);
            await multiStream.createStream("0x5fbdb2315678afecb367f032d93f642f64180aa3","0x70997970C51812dc3A010C7d01b50e0d17dc79C8","0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",100,5,166732456);
            var flowRate = await multiStream.getNetFlowRate("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266");
            expect(flowRate.Inflow - flowRate.Outflow).to.be.lt(0);
        })

    })

  })