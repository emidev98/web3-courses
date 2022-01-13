import {
    Stack,
    Heading,
    Text,
    Table,
    Thead,
    Tr,
    Th,
    Td,
    Tbody,
    Button,
    Tag,
    useToast,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import PunkCard from "../../components/punk-card";
import Loading from "../../components/loading";
import RequestAccess from "../../components/request-access";
import { usePlatziPunkData } from "../../hooks/usePlatziPunksData";
import { useParams } from "react-router-dom";
import { useState } from "react";
import usePlatziPunks from "../../hooks/usePlatziPunks";

const Punk = () => {
    const { active, account, library } = useWeb3React();
    const { tokenId } = useParams();
    const { punk, loading, update } = usePlatziPunkData(tokenId);
    const toast = useToast();
    const platziPunks = usePlatziPunks();
    const [transferring, setTransferring] = useState(false);

    const transfer = async () => {
        setTransferring(true);
        
        const address = prompt("Recipient address :")
        const isAddress = library.utils.isAddress(address);

        if(!isAddress){
            toast({
                title: "Invalid Address",
                description: "Ethereum address is not valid",
                status: "error"
            });
            
            setTransferring(false);
        }
        else {
            await platziPunks.methods
                .safeTransferFrom(
                    punk.owner,
                    address,
                    punk.tokenId
                )
                .send({
                    from : account
                })
                .on('transactionHash', (txHash) => {
                    toast({
                        title: 'Transaction send',
                        description: txHash,
                        status: 'info'
                    });
                })
                .on('receipt', (receipt) => {
                    toast({
                        title: `The NFT has successfully transfered to ${address}`,
                        description: receipt.txHash,
                        status: 'success'
                    });
                    update();
                    setTransferring(false);
                })
                .on('error', (error) => {
                    toast({
                        title: 'Transaction Failed',
                        description: error.message,
                        status: 'error'
                    });
                    setTransferring(false);
                });

        }
    }

    if (!active) return <RequestAccess />

    if (loading) return <Loading />;

    return (
        <Stack
            spacing={{ base: 8, md: 10 }}
            py={{ base: 5 }}
            direction={{ base: "column", md: "row" }}
        >
            <Stack>
                <PunkCard
                    mx={{
                        base: "auto",
                        md: 0,
                    }}
                    name={punk.name}
                    image={punk.image}
                />
                <Button disabled={account !== punk.owner} 
                    colorScheme="green"
                    isLoading={transferring}
                    onClick={transfer}>
                    {account !== punk.owner ? "No eres el dueño" : "Transferir"}
                </Button>
            </Stack>
            <Stack width="100%" spacing={5}>
                <Heading>{punk.name}</Heading>
                <Text fontSize="xl">{punk.description}</Text>
                <Text fontWeight={600}>
                    DNA:
                    <Tag ml={2} colorScheme="green">
                        {punk.dna}
                    </Tag>
                </Text>
                <Text fontWeight={600}>
                    Owner:
                    <Tag ml={2} colorScheme="green">
                        {punk.owner}
                    </Tag>
                </Text>
                <Table size="sm" variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Atributo</Th>
                            <Th>Valor</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {Object.entries(punk.attributes).map(([key, value]) => (
                            <Tr key={key}>
                                <Td>{key}</Td>
                                <Td>
                                    <Tag>{value}</Tag>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Stack>
        </Stack>
    );
};

export default Punk;