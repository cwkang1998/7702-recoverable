import { type BaseError, encodeFunctionData, parseEther } from 'viem'

import { useWaitForTransactionReceipt } from 'wagmi'
import { client } from '../config'
import { ExperimentERC20 } from '../contracts'
import { Account } from '../modules/Account'

export function Mint({ account }: { account: Account.Account }) {
  const {
    data: hash,
    mutate: execute,
    error,
    ...executeQuery
  } = Account.useExecute({
    client,
  })

  const receiptQuery = useWaitForTransactionReceipt({ hash })

  const isPending =
    receiptQuery.fetchStatus === 'fetching' || executeQuery.isPending
  const isSuccess = receiptQuery.isSuccess && executeQuery.isSuccess

  return (
    <div>
      <p>Mint some EXP (ERC20) to your account by clicking the button below.</p>
      <button
        disabled={isPending || isSuccess}
        onClick={() =>
          execute({
            account,
            calls: [
              {
                to: ExperimentERC20.address,
                data: encodeFunctionData({
                  abi: ExperimentERC20.abi,
                  functionName: 'mint',
                  args: [account.address, parseEther('100')],
                }),
              },
            ],
          })
        }
        type="button"
      >
        {isPending ? 'Minting...' : 'Mint 100 EXP'}
      </button>
      {error && <p>{(error as BaseError).shortMessage ?? error.message}</p>}
      {isSuccess && (
        <p>
          Minted 100 EXP ·{' '}
          <a
            href={`${client.chain.blockExplorers.default.url}/tx/${hash}`}
            target="_blank"
            rel="noreferrer"
          >
            Explorer
          </a>
        </p>
      )}
    </div>
  )
}
