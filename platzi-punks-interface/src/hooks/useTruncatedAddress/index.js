import { useMemo } from "react";

const useTruncatedAddress = (account) => {
    const newAddress = useMemo(
      () => `${account?.substr(0, 5)}...${account?.substr(-4)}`,
      [account]
    );
  
    return newAddress;
}

export default useTruncatedAddress;