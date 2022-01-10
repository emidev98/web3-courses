//SPDX-License-Identifier: MIT
pragma solidity >= 0.8.7 < 0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./Base64.sol";
import "./PlatziPunksDNA.sol";

contract PlatziPunks is ERC721, ERC721Enumerable, PlatziPunksDNA {
    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter private _idCounter;
    uint256 public maxSupply;
    mapping(uint256 => uint256) public tokenDNA;

    constructor(uint256 _maxSupply) ERC721("PlatziPunks", "PLPKS") {
        maxSupply = _maxSupply;
    }

    function mint() public {
        uint256 current = _idCounter.current();
        require(current < maxSupply, "No more PlatziPunks left");

        tokenDNA[current] = deterministicPseudoRandomDNA(current, msg.sender);
        _safeMint(msg.sender, current);
        _idCounter.increment();
    }

    function imageByDNA(uint256 _dna) public view returns (string memory) {
        string memory baseURI = _baseURI();
        string memory paramsURI = _paramsURI(_dna);

        return string(abi.encodePacked(baseURI, paramsURI));
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://avataaars.io";
    }

    function _paramsURI(uint256 _dna) internal view returns (string memory) {
        return string (abi.encodePacked(
            "?accessoriesType=",getAccessoriesType(uint8(_dna)),
            "&clotheColor=",getClotheColor(uint8(_dna)),
            "&clotheType=",getClotheType(uint8(_dna)),
            "&eyeType=",getEyeType(uint8(_dna)),
            "&eyebrowType=",getEyeBrowType(uint8(_dna)),
            "&facialHairColor=",getFacialHairColor(uint8(_dna)),
            "&facialHairType=",getFacialHairType(uint8(_dna)),
            "&hairColor=",getHairColor(uint8(_dna)),
            "&hatColor=",getHatColor(uint8(_dna)),
            "&graphicType=",getGraphicType(uint8(_dna)),
            "&mouthType=",getMouthType(uint8(_dna)),
            "&skinColor=",getSkinColor(uint8(_dna))
        ));
    }

    // https://docs.opensea.io/docs/metadata-standards
    function tokenURI(uint256 tokenId) 
        public view override 
        returns (string memory) 
    {
        require(_exists(tokenId), "ERC721 Metadata: URI query for nonexistent token");
        
        uint256 dna = tokenDNA[tokenId];
        string memory image = imageByDNA(dna);

        string memory jsonURI = Base64.encode(
            abi.encodePacked(
            '{',
                '"name": "PlatziPunk #',tokenId.toString(),'",'
                '"description": "Hello World!",',
                '"image":"',image,'"'
            '}'
            )
        );
        
        return string(abi.encodePacked("data:application/json;base64,", jsonURI));
    }

    // The following functions are overrides required by Solidity.
    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
