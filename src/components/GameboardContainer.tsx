import { Gameboard } from './Gameboard';
import styles from '../styles/GameboardContainer.module.css';
import { Button, Text } from '@chakra-ui/react';
import { MouseEventHandler, useContext, useEffect, useState } from 'react';

import { GameContext } from '@/contexts/GameContextProvider';
import { RenderBuyNFTSection } from './BuyNFTSection';
import { useWalletSelector } from '@/contexts/WalletSelectorContext';
import { NFT, NFTCheddarContract } from '@/contracts/nftCheddarContract';
import { useGetCheddarNFTs } from '@/hooks/cheddar';
import { ModalContainer } from './FeedbackModal';
import { RenderCheddarIcon } from './RenderCheddarIcon';
import { IsAllowedResponse } from '@/hooks/maze';
import { RenderIsAllowedErrors } from './RenderIsAllowedErrors';

interface Props {
  remainingMinutes: number;
  remainingSeconds: number;
  handlePowerUpClick: MouseEventHandler<HTMLButtonElement>;
  cellSize: number;
  haveEnoughBalance: boolean | null;
  minCheddarRequired: number;
  isAllowed: IsAllowedResponse | null | undefined;
}

export function GameboardContainer({
  remainingMinutes,
  remainingSeconds,
  handlePowerUpClick,
  cellSize,
  haveEnoughBalance,
  minCheddarRequired,
  isAllowed,
}: Props) {
  const {
    mazeData,
    score,
    gameOverFlag,
    gameOverMessage,
    selectedColorSet,
    hasPowerUp,
    isPowerUpOn,
    handleKeyPress,
    handleTouchMove,
    restartGame,
  } = useContext(GameContext);

  const [showBuyNFTPanel, setShowBuyNFTPanel] = useState(false);
  const [showRules, setShowRules] = useState(false);

  function toggleShowRules() {
    setShowRules(!showRules);
  }

  function handleBuyClick() {
    setShowBuyNFTPanel(!showBuyNFTPanel);
  }

  const [contract, setContract] = useState<NFTCheddarContract | undefined>();
  const [nfts, setNFTs] = useState<NFT[]>([]);
  const { data: cheddarNFTsData, isLoading: isLoadingCheddarNFTs } =
    useGetCheddarNFTs();
  const { modal, selector, accountId } = useWalletSelector();

  useEffect(() => {
    if (!selector.isSignedIn()) {
      setNFTs([]);
      return;
    }
    selector.wallet().then((wallet) => {
      const contract = new NFTCheddarContract(wallet);
      setContract(contract);

      contract.getNFTs('silkking.testnet').then((nfts) => {
        setNFTs(nfts);
      });
    });
  }, [selector]);

  function getGameContainerClasses() {
    return `${styles.gameContainer} backgroundImg${selectedColorSet}`;
  }

  function logOut() {
    selector.wallet().then((wallet) => wallet.signOut());
  }

  console.log('isAllowed: ', isAllowed);

  return (
    <div
      className={getGameContainerClasses()}
      style={{
        maxWidth: `${mazeData[0].length * cellSize + 25}px`,
      }}
    >
      {accountId && !haveEnoughBalance && (
        <Text color="tomato">
          You have to hold at least {minCheddarRequired}
          {RenderCheddarIcon({ width: '2rem' })} to earn.
        </Text>
      )}
      {selector.isSignedIn() ? (
        <div>
          <Button onClick={logOut}>Log out</Button>
        </div>
      ) : (
        <Button onClick={modal.show}>Login</Button>
      )}
      <h1>Cheddar Maze</h1>
      <div className={styles.gameInfo}>
        <div className={styles.score}>Score: {score}</div>
        <div className={styles.time}>
          Time:{' '}
          {remainingMinutes < 10 ? '0' + remainingMinutes : remainingMinutes}:
          {remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}
        </div>
      </div>
      <div className={styles.gameOver}>{gameOverMessage}</div>
      {gameOverFlag && (
        <button onClick={restartGame} className={styles.restartGameButton}>
          Restart Game
        </button>
      )}

      {accountId && isAllowed?.ok ? (
        <RenderIsAllowedErrors errors={isAllowed?.errors!} />
      ) : (
        <div
          className={styles.mazeContainer}
          tabIndex={0}
          onKeyDown={handleKeyPress}
          onTouchMove={handleTouchMove}
        >
          <div className={styles.toolbar}>
            <span className={styles.rulesButton}>
              <Button onClick={toggleShowRules}>Rules</Button>
            </span>
            <div className={styles.tooltip}>
              <Button
                colorScheme="yellow"
                onClick={handlePowerUpClick}
                disabled={!hasPowerUp}
              >
                ⚡
              </Button>
              <span className={styles.tooltipText}>
                Cheddy PowerUp NFT provides in-game features
              </span>
              {!hasPowerUp && (
                <span className={styles.buyPowerUp}>
                  <Button
                    colorScheme="purple"
                    onClick={handleBuyClick}
                    disabled={!hasPowerUp}
                  >
                    Buy
                  </Button>
                  {showBuyNFTPanel && (
                    <div className={styles.popup}>
                      <RenderBuyNFTSection />
                    </div>
                  )}
                </span>
              )}
            </div>
          </div>
          <Gameboard
            showRules={showRules}
            openLogIn={modal.show}
            isUserLoggedIn={selector.isSignedIn()}
          />
        </div>
      )}
    </div>
  );
}
