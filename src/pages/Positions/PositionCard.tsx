import {useMemo} from 'react'
import styled from 'styled-components/macro'
import {Link} from 'react-router-dom'
import {Icon} from '../../components/Icon/Icon'
import {ChevronRight} from 'react-feather'
import {FlexRow} from '../../components/Container/Container'
import {formatBigNumberUsingDecimalsToString} from '../../utils/formatWei'
import Loader from '../../components/Loaders/Loaders'

const CardHeaderContainer = styled(FlexRow)`
  color: white;
  padding-bottom: 8px;
  border-bottom: 1px solid #828282;
`

const PositionCardColumn = styled.div<{align?: string; width?: string}>`
  width: ${({width}) => (width ? width : 'auto')};
  text-align: ${({align}) => (align ? align : 'left')};
  font-size: 14px;
`

const HeaderCell = styled(PositionCardColumn)`
  font-weight: 700;
`

const Detail = styled.div<{fontWeight?: number; color?: string}>`
  color: ${({color}) => (color ? color : 'white')};
  font-weight: ${({fontWeight}) => (fontWeight ? fontWeight : 400)};
  text-align: inherit;
`

const CardContainer = styled(Link)<{navigate?: boolean; border?: boolean; hide: boolean}>`
  pointer-events: ${({navigate}) => (navigate ? 'auto' : 'none')};
  border-bottom: ${({border}) => (border ? '1px solid #828282' : 'none')};
  display: ${({hide}) => (hide ? 'none' : 'flex')};
  flex-direction: row;
  width: 100%;
  padding: 16px 0;
  min-height: 69px;
  text-decoration: none;

  :hover {
    background: #262626 !important;
  }
`

export const PositionTableHeader = () => (
  <CardHeaderContainer>
    <HeaderCell align="left" width="50%">
      Position
    </HeaderCell>

    <HeaderCell align="left" width="30%">
      Est. Liq.
    </HeaderCell>

    <HeaderCell align="right" width="20%">
      PnL
    </HeaderCell>
  </CardHeaderContainer>
)

export const PositionCard = ({
  id,
  positionId,
  marketId,
  baseToken,
  quoteToken,
  quoteTokenDecimals,
  isLong,
  leverage,
  value,
  cost,
  oi,
  collateralToken,
  estLiquidationPrice,
  isLiquidated,
  navigate,
  border = true,
  userHideClosedPositions,
}: {
  id: string
  positionId: string
  marketId: string
  baseToken: string
  quoteToken: string
  quoteTokenDecimals: number
  isLong: boolean | null
  leverage: number | string
  value: number | string | null | undefined
  cost: number | string | null | undefined
  oi: number | string | null | undefined
  collateralToken: string
  estLiquidationPrice: number | string | null | undefined
  isLiquidated?: boolean
  navigate?: boolean
  border?: boolean
  userHideClosedPositions: boolean
}) => {
  const parsedLeverage = Number(leverage).toFixed(1)

  const PnL = useMemo(() => {
    if (value === 'loading' || cost === 'loading') {
      return {color: 'white', result: <Loader stroke="white" size="12px" />}
    }
    if (typeof value === 'number' && typeof cost === 'number') {
      const difference = value - cost
      const color = difference > 0 ? '#10DCB1' : difference === 0 ? 'white' : '#FF648A'
      return {color, result: `${difference.toFixed(4)} ${collateralToken}`}
    }
    return {color: 'gray', result: 'error'}
  }, [value, cost, collateralToken])

  const formattedEstLiquidationPrice = useMemo(() => {
    if (!estLiquidationPrice || estLiquidationPrice === undefined || !quoteTokenDecimals)
      return <Loader stroke="white" size="12px" />
    if (typeof estLiquidationPrice === 'string') return estLiquidationPrice
    return formatBigNumberUsingDecimalsToString(estLiquidationPrice, quoteTokenDecimals, 2)
  }, [estLiquidationPrice, quoteTokenDecimals])

  const shouldHidePosition = useMemo(() => {
    if (!userHideClosedPositions) return false
    if (!oi && oi !== 0) return false
    return oi == 0 ? true : false
  }, [oi, userHideClosedPositions])

  return (
    <CardContainer
      navigate={navigate}
      border={border}
      to={`/positions/${id}/${positionId}`}
      hide={shouldHidePosition}
    >
      <PositionCardColumn width="50%">
        <Detail fontWeight={700} color={'white'}>
          {baseToken === 'loading' ? <Loader stroke="white" size="12px" /> : baseToken}/
          {quoteToken === 'loading' ? <Loader stroke="white" size="12px" /> : quoteToken}
        </Detail>

        {/* <Detail fontWeight={700} color={'white'}>
          ID: {Number(positionId)}
        </Detail> */}

        {isLong === null && (
          <Detail fontWeight={700} color={'#C0C0C0'}>
            loading...
          </Detail>
        )}

        {isLong === true && (
          <Detail fontWeight={700} color={'#10DCB1'}>
            Long {parsedLeverage}x
          </Detail>
        )}

        {isLong === false && (
          <Detail fontWeight={700} color={'#FF648A'}>
            Short {parsedLeverage}x
          </Detail>
        )}

        <Detail color={'#C0C0C0'}>OI: {oi === undefined ? 'loading...' : oi}</Detail>

        <Detail color={'#C0C0C0'}>
          Value: {value === 'loading' ? 'loading...' : `${value} ${collateralToken}`}
        </Detail>
      </PositionCardColumn>

      <PositionCardColumn width="20%">
        <Detail fontWeight={700} color={'white'}>
          {isLiquidated ? 'Liquidated' : formattedEstLiquidationPrice}
        </Detail>
      </PositionCardColumn>

      <PositionCardColumn width="30%" align="right">
        <Detail fontWeight={700} color={PnL.color}>
          {PnL.result}
        </Detail>

        {navigate ?? (
          <Icon size={12} margin={'24px 0 0 auto'}>
            <ChevronRight />
          </Icon>
        )}
      </PositionCardColumn>
    </CardContainer>
  )
}
