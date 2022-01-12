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

const usePlatziPunksData = () => {
    const [punks, setPunks] = useState([]);
    const [loading, setLoading] = useState(true);
    const platziPunks = usePlatziPunks();

    const update = useCallback( async () => {
        if(platziPunks) {
            setLoading(true);

            let tokenIds;
            const totalSupply = await platziPunks.methods.totalSupply().call();
            tokenIds = new Array(parseInt(totalSupply)).fill().map((_, index) => index);
            const punksPromise = tokenIds.map(tokenId => getPunkData(tokenId, platziPunks));
            const punks = await Promise.all(punksPromise);

            setPunks(punks);
            setLoading(false);
        }
    },[platziPunks]);

    useEffect(()=>{
        update();
    }, [update]);

    return {
        loading,
        punks,
        update
    }
}

const usePlatziPunkData = () => {
    
}

export {usePlatziPunksData, usePlatziPunkData};