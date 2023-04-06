import { FC, useState } from 'react'
import { LNBITS_API_HOST } from '@/utils/app/const'

interface Props {
  onLnbitsKeyChange: (data: object) => void;
  lnbitsKey: object;
}

export const LnbitsKey: FC<Props> = ({
  lnbitsKey,
  onLnbitsKeyChange,
}) => {
  const [loading, setLoading] = useState<boolean>(false)

  const handleEnter = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
    }
  };

  const createNewKey = async () => {
    setLoading(true)

    const response = await fetch('api/createLnbits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if(!response.ok) {
      alert("An error occurred creating a new LNBits Key.")
      setLoading(false)
      return
    }

    const data = await response.json()

    onLnbitsKeyChange(data)
    setLoading(false)
  }

  return (
    <div className="mt-6 rounded border p-4">
      <div className="text-xl font-bold">LNBits Billing Plugin</div>
      <div className="mt-4 italic">
        {loading &&
          <span>We're generating a new wallet for you now, please wait...</span>
        }

        {!loading &&
          <span>Please link a LNBits Wallet to enable billing.</span>
        }
      </div>

      {lnbitsKey.id &&
        <div>
          <button
            className="mt-6 w-full rounded-lg border border-neutral-500 px-4 py-2 text-neutral-900 shadow hover:bg-neutral-100 focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-300"
            onClick={() => {
              window.open(`${LNBITS_API_HOST}/wallet?usr=${lnbitsKey.id}&wal=${lnbitsKey.wallets[0].id}`, '_blank')
            }}>
            Manage Wallet
          </button>
          <button
            className="mt-6 w-full rounded-lg border border-neutral-500 px-4 py-2 text-neutral-900 shadow hover:bg-neutral-100 focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-300"
            onClick={() => {
              const conf = confirm("If you did not back up the keys to this wallet, all funds will be lost. Continue?")

              if(conf) {
                onLnbitsKeyChange({})
              }
            }}>
            Unlink LNBits Wallet
          </button>
        </div>
      }

      {!lnbitsKey.id && !loading && 
        <button
          className="mt-6 w-full rounded-lg border border-neutral-500 px-4 py-2 text-neutral-900 shadow hover:bg-neutral-100 focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-300"
          onClick={createNewKey}>
          Create New Wallet
        </button>
      }
    </div>
  )
}