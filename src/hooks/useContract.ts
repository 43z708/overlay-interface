import {useMemo} from 'react'
import {useActiveWeb3React} from './web3'
import {Contract} from '@ethersproject/contracts'
import {getContract} from '../utils/contract'
import {MULTICALL2_ADDRESS, V1_PERIPHERY_ADDRESS, OVL_TOKEN_ADDRESS} from '../constants/addresses'
import MULTICALL2_ABI from '../constants/multicall/multicall2.json'
import ERC20_ABI from '../constants/abis/erc20.json'
import ERC20_BYTES32_ABI from '../constants/abis/erc20_bytes32.json'
import V1_MARKET_ABI from '../constants/abis/OverlayV1Market.json'
import V1_PERIPHERY_ABI from '../constants/abis/OverlayV1State.json'
import OVL_TOKEN_ABI from '../constants/abis/OverlayV1Token.json'
import UNISWAP_V3_FEED_ABI from '../constants/abis/OverlayV1UniswapV3Feed.json'

// returns null on errors
export function useContract<T extends Contract = Contract>(
  address: string | undefined,
  ABI: any,
  withSignerIfPossible = true,
): T | null {
  const {library, account} = useActiveWeb3React()

  return useMemo(() => {
    if (!address || !ABI || !library) return null
    try {
      return getContract(
        address,
        ABI,
        library,
        withSignerIfPossible && account ? account : undefined,
      )
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, library, withSignerIfPossible, account]) as T
}

export function useMulticall2Contract(): Contract | null {
  const {chainId} = useActiveWeb3React()
  return useContract(chainId && MULTICALL2_ADDRESS[chainId], MULTICALL2_ABI, false)
}

export function useV1PeripheryContract(): Contract | null {
  const {chainId} = useActiveWeb3React()
  return useContract(chainId && V1_PERIPHERY_ADDRESS[chainId], V1_PERIPHERY_ABI, false)
}

export function useUniswapV3FeedContract(address: string | undefined): Contract | null {
  const {chainId} = useActiveWeb3React()
  return useContract(chainId && address, UNISWAP_V3_FEED_ABI, false)
}

export function useMarketContract(address: string | undefined): Contract | null {
  return useContract(address, V1_MARKET_ABI, false)
}

export function useOvlTokenContract(): Contract | null {
  const {chainId} = useActiveWeb3React()
  return useContract(chainId && OVL_TOKEN_ADDRESS[chainId], OVL_TOKEN_ABI, false)
}

export function useTokenContract(
  tokenAddress?: string,
  withSignerIfPossible?: boolean,
): Contract | null {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useBytes32TokenContract(
  tokenAddress?: string,
  withSignerIfPossible?: boolean,
): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}
