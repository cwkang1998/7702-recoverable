import { AccountDetails } from './components/AccountDetails';
import { InitializeAccount } from './components/InitializeAccount';
import { Mint } from './components/Mint';
import { Send } from './components/Send';
import { client } from './config';
import { Account } from './modules/Account';

export function App() {
  const { data: account } = Account.useQuery();

  return (
    <div>
      <h1>Example EIP-7702 Delegation</h1>

      <p>
        <strong>Chain:</strong> {client.chain.name} ({client.chain.id}){' · '}
        <a
          href={client.chain.blockExplorers?.default.url}
          target="_blank"
          rel="noreferrer"
        >
          Explorer
        </a>
      </p>

      <h2>1. Initialize</h2>
      <p>
        Initialize a new EOA controlled by a WebAuthn key. You can either create
        a new one or use an existing.
      </p>
      <InitializeAccount />

      {account && (
        <>
          <h2>2. Account</h2>
          <AccountDetails account={account} />

          <h2>3. Mint EXP (ERC20)</h2>
          <Mint account={account} />

          <h2>4. Batch Send EXP</h2>
          <Send account={account} />
        </>
      )}
    </div>
  );
}
