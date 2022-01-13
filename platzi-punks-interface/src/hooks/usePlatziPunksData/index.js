import { useWeb3React } from "@web3-react/core";
import { useCallback, useEffect, useState } from "react";
import usePlatziPunks from "../usePlatziPunks";

const getPunkData = async (tokenId, platziPunks) => {
    const [
        tokenURI,
        dna,
        owner,
        accessoriesType,
        clotheColor,
        clotheType,
        eyeType,
        eyeBrowType,
        facialHairColor,
        facialHairType,
        hairColor,
        hatColor,
        graphicType,
        mouthType,
        skinColor,
        topType
    ] = await Promise.all([
        platziPunks.methods.tokenURI(tokenId).call(),
        platziPunks.methods.tokenDNA(tokenId).call(),
        platziPunks.methods.ownerOf(tokenId).call(),
        platziPunks.methods.getAccessoriesType(tokenId).call(),
        platziPunks.methods.getClotheColor(tokenId).call(),
        platziPunks.methods.getClotheType(tokenId).call(),
        platziPunks.methods.getEyeType(tokenId).call(),
        platziPunks.methods.getEyeBrowType(tokenId).call(),
        platziPunks.methods.getFacialHairColor(tokenId).call(),
        platziPunks.methods.getFacialHairType(tokenId).call(),
        platziPunks.methods.getHairColor(tokenId).call(),
        platziPunks.methods.getHatColor(tokenId).call(),
        platziPunks.methods.getGraphicType(tokenId).call(),
        platziPunks.methods.getMouthType(tokenId).call(),
        platziPunks.methods.getSkinColor(tokenId).call(),
        platziPunks.methods.getTopType(tokenId).call(),
    ]);

    const responseMetadata = await fetch(tokenURI);
    const metadata = await responseMetadata.json();

    return {
        tokenId, 
        tokenURI,
        dna,
        owner,
        attributes: {
            accessoriesType,
            clotheColor,
            clotheType,
            eyeType,
            eyeBrowType,
            facialHairColor,
            facialHairType,
            hairColor,
            hatColor,
            graphicType,
            mouthType,
            skinColor,
            topType
        },
        ...metadata
    };
}

const usePlatziPunksData = (owner = null) => {
    const { library } = useWeb3React();
    const [punks, setPunks] = useState([]);
    const [loading, setLoading] = useState(true);
    const platziPunks = usePlatziPunks();

    const update = useCallback( async () => {
        if(platziPunks) {
            setLoading(true);

            var tokenIds;
            if(!library.utils.isAddress(owner)){
                const totalSupply = await platziPunks.methods.totalSupply().call();
                tokenIds = new Array(parseInt(totalSupply))
                    .fill()
                    .map((_, index) => index);
            }
            else {
                const balanceOfOwner = await platziPunks.methods
                    .balanceOf(owner)
                    .call();

                const tokenIdsOfOwner = new Array(Number(balanceOfOwner))
                    .fill()
                    .map((_, index) => platziPunks.methods.tokenOfOwnerByIndex(owner, index).call());
                tokenIds = await Promise.all(tokenIdsOfOwner);
            }
            const punksPromise = tokenIds.map(tokenId => getPunkData(tokenId, platziPunks));
            const punks = await Promise.all(punksPromise);

            setPunks(punks);
            setLoading(false);
        }
    },[platziPunks, owner, library?.utils]);

    useEffect(()=>{
        update();
    }, [update]);

    return {
        loading,
        punks,
        update
    }
}

const usePlatziPunkData = (tokenId = null) => {
    const [punk, setPunk] = useState();
    const [loading, setLoading] = useState(true);
    const platziPunks = usePlatziPunks();

    const update = useCallback(async ()=>{
        if(platziPunks && tokenId != null){
            setLoading(true);

            const punk = await getPunkData(tokenId, platziPunks)
            setPunk(punk);

            setLoading(false);
        }
    }, [platziPunks, tokenId]);

    useEffect(()=>{
        update();
    }, [update]);

    return { loading, punk, update }
}

export {usePlatziPunksData, usePlatziPunkData};