import { 
    Stack,
    Flex,
    Heading,
    Text,
    Button,
    Image,
    Badge,
    useToast
} from '@chakra-ui/react';
import { Link } from "react-router-dom";
import { useWeb3React } from '@web3-react/core';
import { useCallback, useEffect, useState } from "react";
import usePlatziPunks from '../../hooks/usePlatziPunks';
import useTruncatedAddress from '../../hooks/useTruncatedAddress';

const Home = () => {
    const [isMinting, setIsMinting] = useState(false);
    const [imageSrc, setImageSrc] = useState("");
    const { active, account } = useWeb3React();
    const platziPunks = usePlatziPunks();
    const toast = useToast();

    const getPlatziPunksData = useCallback(async () => {
      if (platziPunks) {
        const totalSupply = await platziPunks.methods.totalSupply().call();
        const dnaPreview = await platziPunks.methods
          .deterministicPseudoRandomDNA(totalSupply, account)
          .call();
        const image = await platziPunks.methods.imageByDNA(dnaPreview).call();
        setImageSrc(image);
      }
    }, [platziPunks, account]);
  
    useEffect(() => {
      getPlatziPunksData();
    }, [getPlatziPunksData]);
  
    const truncatedAddress = useTruncatedAddress(account);

    const mint = () => {
        setIsMinting(true);

        platziPunks.methods.mint()
            .send({from: account})
            .on('transactionHash', (txHash) => {
                toast({
                    title: 'Transaction send',
                    description: txHash,
                    status: 'info'
                });
            })
            .on('receipt', (receipt) => {
                setIsMinting(false);
                toast({
                    title: 'Transaction confirmed',
                    description: receipt.txHash,
                    status: 'success'
                });
            })
            .on('error', (error) => {
                setIsMinting(false);
                toast({
                    title: 'Transaction Failed',
                    description: error.message,
                    status: 'error'
                });
            });
    };

    return (
      <Stack
        align={"center"}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 20, md: 28 }}
        direction={{ base: "column-reverse", md: "row" }}
      >
        <Stack flex={1} spacing={{ base: 5, md: 10 }}>
          <Heading
            lineHeight={1.1}
            fontWeight={600}
            fontSize={{ base: "3xl", sm: "4xl", lg: "6xl" }}
          >
            <Text
              as={"span"}
              position={"relative"}
              _after={{
                content: "''",
                width: "full",
                height: "30%",
                position: "absolute",
                bottom: 1,
                left: 0,
                bg: "green.400",
                zIndex: -1,
              }}
            >
              Un Platzi Punk
            </Text>
            <br />
            <Text as={"span"} color={"green.400"}>
              nunca para de aprender
            </Text>
          </Heading>
          <Text color={"gray.500"}>
            Platzi Punks es una colección de Avatares randomizados cuya metadata
            es almacenada on-chain. Poseen características únicas y sólo hay 10000
            en existencia.
          </Text>
          <Text color={"green.500"}>
            Cada Platzi Punk se genera de forma secuencial basado en tu address,
            usa el previsualizador para averiguar cuál sería tu Platzi Punk si
            minteas en este momento
          </Text>
          <Stack
            spacing={{ base: 4, sm: 6 }}
            direction={{ base: "column", sm: "row" }}
          >
            <Button
              rounded={"full"}
              size={"lg"}
              fontWeight={"normal"}
              px={6}
              colorScheme={"green"}
              bg={"green.400"}
              _hover={{ bg: "green.500" }}
              onClick={mint}
              isLoading={isMinting}
              disabled={!platziPunks}
            >
              Obtén tu punk
            </Button>
            <Link to="/punks">
              <Button rounded={"full"} size={"lg"} fontWeight={"normal"} px={6}>
                Galería
              </Button>
            </Link>
          </Stack>
        </Stack>
        <Flex
          flex={1}
          direction="column"
          justify={"center"}
          align={"center"}
          position={"relative"}
          w={"full"}
        >
          <Image src={active ? imageSrc : "https://avataaars.io/"} />
          {active ? (
            <>
              <Flex mt={2}>
                <Badge>
                  Next ID:
                  <Badge ml={1} colorScheme="green">
                    1
                  </Badge>
                </Badge>
                <Badge ml={2}>
                  Address:
                  <Badge ml={1} colorScheme="green">
                    {truncatedAddress}
                  </Badge>
                </Badge>
              </Flex>
              <Button
                onClick={getPlatziPunksData}
                mt={4}
                size="xs"
                colorScheme="green"
              >
                Actualizar
              </Button>
            </>
          ) : (
            <Badge mt={2}>Wallet desconectado</Badge>
          )}
        </Flex>
      </Stack>
    );
  }

export default Home;