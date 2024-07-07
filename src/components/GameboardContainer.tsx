import { Gameboard } from './Gameboard';
import styles from '../styles/GameboardContainer.module.css';
import { Button, Link, Show, useDisclosure } from '@chakra-ui/react';
import { MouseEventHandler, useContext, useMemo, useState } from 'react';

import { GameContext } from '@/contexts/GameContextProvider';
import { ModalBuyNFT } from './ModalBuyNFT';
import { useWalletSelector } from '@/contexts/WalletSelectorContext';
import { ModalContainer } from './ModalContainer';
import { RenderCheddarIcon } from './RenderCheddarIcon';
import { IsAllowedResponse } from '@/hooks/maze';
import ModalNotAllowedToPlay from './ModalNotAllowedToPlay';
import ModalRules from './ModalRules';
import { GameOverModalContent } from './GameOverModalContent';
import {
  ArrowBackIcon,
  ArrowDownIcon,
  ArrowForwardIcon,
  ArrowUpIcon,
} from '@chakra-ui/icons';
import { Scoreboard } from './Scoreboard';

interface Props {
  remainingMinutes: number;
  remainingSeconds: number;
  handlePowerUpClick: MouseEventHandler<HTMLButtonElement>;
  cellSize: number;
  hasEnoughBalance: boolean | null;
  minCheddarRequired: number;
  isAllowedResponse: IsAllowedResponse | null | undefined;
  cheddarBalanceData: bigint | null | undefined;
}

export function GameboardContainer({
  remainingMinutes,
  remainingSeconds,
  handlePowerUpClick,
  cellSize,
  hasEnoughBalance,
  minCheddarRequired,
  isAllowedResponse,
}: Props) {
  const {
    mazeData,
    score,
    gameOverFlag,
    gameOverMessage,
    selectedColorSet,
    hasPowerUp,
    handleKeyPress,
    restartGame,
    timerStarted,
    setGameOverMessage,
    saveResponse,
    videoModalOpened,
    onCloseVideoModal,
    isScoreboardOpen,
    onOpenScoreboard,
    onCloseScoreboard,
    nfts,
    handleArrowPress,
    showMovementButtons,
    setShowMovementButtons,
  } = useContext(GameContext);

  const {
    isOpen: isOpenNotAlloWedModal,
    onOpen: onOpenNotAlloWedModal,
    onClose: onCloseNotAlloWedModal,
  } = useDisclosure();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [allowOpenGameOverModal, setAllowOpenGameOverModal] = useState(false);

  if (gameOverFlag && gameOverMessage.length > 0 && !allowOpenGameOverModal) {
    onOpen();
    setAllowOpenGameOverModal(true);
  }

  const {
    isOpen: isOpenModalRules,
    onOpen: onOpenModalRules,
    onClose: onCloseModalRules,
  } = useDisclosure();

  const {
    isOpen: isOpenBuyNFTPanel,
    onOpen: onOpenBuyNFTPanel,
    onClose: onCloseBuyNFTPanel,
  } = useDisclosure();

  const { modal, selector, accountId } = useWalletSelector();

  const userIsNotAllowedToPlay = useMemo(() => {
    return accountId && !isAllowedResponse?.ok;
  }, [accountId, isAllowedResponse?.ok]);

  function getProperHandler(handler: any) {
    //Uncomment the next line to ignore the isAllowedResponse.ok returning false
    // return handler;
    if (isAllowedResponse?.ok) {
      return handler;
    }
    return onOpenNotAlloWedModal;
  }

  function getGameContainerClasses() {
    return `${styles.gameContainer} backgroundImg${selectedColorSet}`;
  }

  function handleBuyClick() {
    return selector.isSignedIn() ? onOpenBuyNFTPanel() : modal.show();
  }

  function logOut() {
    selector.wallet().then((wallet) => wallet.signOut());
  }

  function getStartGameButtonHandler() {
    return accountId //If the accountId exists
      ? hasEnoughBalance //And have enough balance
        ? getProperHandler(restartGame)
        : () => {} //If doesn't have enough balance
      : modal.show; //If accountId doesn't exist
  }

  function getKeyDownMoveHandler() {
    return timerStarted ? getProperHandler(handleKeyPress) : () => {};
  }

  function getStartButtonStyles() {
    return `${styles.rulesButton} ${timerStarted ? styles.hideButton : ''}`;
  }

  function closeGameOverModal() {
    setGameOverMessage('');
    onClose();
    setAllowOpenGameOverModal(false);
  }

  function smartTrim(string: string, maxLength: number) {
    if (!string) return string;
    if (maxLength < 1) return string;
    if (string.length <= maxLength) return string;
    if (maxLength == 1) return string.substring(0, 1) + '...';

    var midpoint = Math.ceil(string.length / 2);
    var toremove = string.length - maxLength;
    var lstrip = Math.ceil(toremove / 2);
    var rstrip = toremove - lstrip;
    return (
      string.substring(0, midpoint - lstrip) +
      '...' +
      string.substring(midpoint + rstrip)
    );
  }

  function handleToggleShowMovementButtons() {
    setShowMovementButtons(!showMovementButtons);
  }

  const renderSwipeIcon = () => {
    return (
      <svg viewBox="0 -1.5 21 21">
        <title>swipe</title>
        <defs></defs>
        <g
          id="Page-1"
          stroke="none"
          stroke-width="1"
          fill="none"
          fill-rule="evenodd"
        >
          <g
            id="Dribbble-Light-Preview"
            transform="translate(-139.000000, -800.000000)"
            fill="#000000"
          >
            <g id="icons" transform="translate(56.000000, 160.000000)">
              <path
                d="M87.2,645.00025 C87.2,644.44825 86.7296,644.00025 86.15,644.00025 L84.05,644.00025 C83.4704,644.00025 83,644.44825 83,645.00025 C83,645.55225 83.4704,646.00025 84.05,646.00025 L86.15,646.00025 C86.7296,646.00025 87.2,645.55225 87.2,645.00025 M103.38575,643.83125 L103.01195,643.47425 L99.67295,640.29325 C99.2624,639.90225 98.5967,639.90225 98.1872,640.29325 C97.77665,640.68425 97.77665,641.31725 98.1872,641.70725 L99.95225,643.26825 C100.283,643.58325 100.04885,644.00025 99.58055,644.00025 L94.18985,644.00025 C93.6092,644.00025 93.13985,644.44825 93.13985,645.00025 C93.13985,645.55225 93.6092,646.00025 94.18985,646.00025 L99.58265,646.00025 C100.05095,646.00025 100.2851,646.66025 99.95435,646.97525 L98.1872,648.71725 C97.7777,649.10825 97.7777,649.77125 98.1872,650.16225 C98.59775,650.55225 99.2624,650.56725 99.6719,650.17725 L103.38575,646.64825 C104.20475,645.86725 104.20475,644.61225 103.38575,643.83125 M97.3451,653.04225 L96.9965,656.59925 C96.80015,657.53425 95.9381,658.00025 94.93745,658.00025 L89.8607,658.00025 C89.51525,658.00025 89.1908,658.04525 88.9955,657.77425 L86.7275,653.84725 C86.4419,653.45425 86.49125,652.92325 86.8451,652.58625 C87.3008,652.15225 88.05575,652.21425 88.42535,652.71625 L89.3,653.90925 L89.3,645.41425 C89.3,644.86225 89.7746,644.41425 90.3542,644.41425 C91.10075,644.41425 91.4084,645.06025 91.4084,645.41425 L91.4168,650.45825 L95.94965,650.85625 C96.9545,651.17425 97.553,652.05325 97.3451,653.04225"
                id="swipe-toggle-icon"
              ></path>
            </g>
          </g>
        </g>
      </svg>
    );
  };

  const renderArrowsIcon = () => {
    return (
      <svg
        fill="#000000"
        viewBox="-6 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>arrows</title>
        <path d="M19.72 15.4l-2.24-2.2c-0.32-0.32-0.84-0.32-1.2 0-0.32 0.32-0.32 0.84 0 1.2l0.8 0.8h-6.28v-6.24l0.8 0.8c0.16 0.16 0.36 0.24 0.6 0.24 0.2 0 0.44-0.080 0.6-0.24 0.32-0.32 0.32-0.84 0-1.2l-2.24-2.24c-0.6-0.72-1.2-0.040-1.2-0.040l-2.24 2.24c-0.32 0.32-0.32 0.84 0 1.2 0.32 0.32 0.84 0.32 1.2 0l0.8-0.8v6.28h-6.2l0.8-0.8c0.32-0.32 0.32-0.84 0-1.2-0.32-0.32-0.84-0.32-1.2 0l-2.24 2.24c-0.32 0.32-0.32 0.84 0 1.16l2.24 2.2c0.16 0.16 0.36 0.24 0.6 0.24 0.2 0 0.44-0.080 0.6-0.24 0.32-0.32 0.32-0.84 0-1.2l-0.8-0.8h6.24v6.24l-0.8-0.8c-0.32-0.32-0.84-0.32-1.2 0-0.32 0.32-0.32 0.84 0 1.2l2.24 2.24c0.4 0.4 0.68 0.4 1.12-0.040l2.24-2.24c0.44-0.28 0.44-0.8 0.080-1.12-0.32-0.32-0.84-0.32-1.2 0l-0.8 0.8v-6.28h6.24l-0.8 0.8c-0.32 0.32-0.32 0.84 0 1.2 0.16 0.16 0.36 0.24 0.6 0.24s0.44-0.080 0.6-0.24l2.24-2.24c0.32-0.28 0.32-0.88 0-1.16z"></path>
      </svg>
    );
  };

  return (
    <div
      className={getGameContainerClasses()}
      onKeyDown={getKeyDownMoveHandler()}
      style={{
        maxWidth: `${mazeData[0].length * cellSize + 25}px`,
      }}
    >
      <div className={styles.publicityDecoration}></div>

      {accountId && (!hasEnoughBalance || userIsNotAllowedToPlay) && (
        <Link
          target="_blank"
          className={styles.notEnoughBalanceMsg}
          href="https://app.ref.finance/#a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near%7Ctoken.cheddar.near"
        >
          Must have {minCheddarRequired}
          {RenderCheddarIcon({ width: '2rem' })} and Verified Human to play.
        </Link>
      )}

      <h1 className={styles.gameName}>Cheddar Maze</h1>

      <div className={styles.gameInfo}>
        <div className={styles.score}>Score: {score}</div>
        <div className={styles.time}>
          Time:{' '}
          {remainingMinutes < 10 ? '0' + remainingMinutes : remainingMinutes}:
          {remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}
        </div>
      </div>

      <div className={styles.mazeContainer} tabIndex={0}>
        <div className={styles.toolbar}>
          <span className={styles.rulesButton}>
            <Button onClick={onOpenModalRules}>Rules</Button>
          </span>

          <span className={getStartButtonStyles()}>
            {hasEnoughBalance && (
              <Button onClick={getStartGameButtonHandler()}>
                {gameOverFlag ? 'Restart Game' : 'Start Game'}
              </Button>
            )}
          </span>

          <div className={styles.tooltip}>
            <Button
              colorScheme={nfts && nfts.length > 0 ? 'yellow' : 'gray'}
              onClick={handleBuyClick}
            >
              ⚡
            </Button>
            <span className={styles.tooltipText}>
              Cheddy PowerUp NFT provides in-game features
            </span>

            <Show below="lg">
              <Button
                onClick={() => handleToggleShowMovementButtons()}
                colorScheme="gray"
              >
                <div className={styles.togglePlayModeIconContainer}>
                  {showMovementButtons ? renderSwipeIcon() : renderArrowsIcon()}
                </div>
              </Button>
            </Show>
          </div>
        </div>
        <Gameboard
          openLogIn={modal.show}
          isUserLoggedIn={selector.isSignedIn()}
          isAllowedResponse={isAllowedResponse!}
        />

        {showMovementButtons && (
          <Show below="lg">
            <div className={styles.arrowButtonsContainer}>
              <div className={styles.arrowButtonsFirstLine}>
                <Button
                  onClick={() => handleArrowPress('ArrowUp')}
                  disabled={!hasPowerUp}
                >
                  <ArrowUpIcon />
                </Button>
              </div>
              <div className={styles.arrowButtonsSecondLine}>
                <Button
                  onClick={() => handleArrowPress('ArrowLeft')}
                  disabled={!hasPowerUp}
                >
                  <ArrowBackIcon />
                </Button>
                <Button
                  onClick={() => handleArrowPress('ArrowDown')}
                  disabled={!hasPowerUp}
                >
                  <ArrowDownIcon />
                </Button>
                <Button
                  onClick={() => handleArrowPress('ArrowRight')}
                  disabled={!hasPowerUp}
                >
                  <ArrowForwardIcon />
                </Button>
              </div>
            </div>
          </Show>
        )}
      </div>

      <ModalBuyNFT onClose={onCloseBuyNFTPanel} isOpen={isOpenBuyNFTPanel} />
      {userIsNotAllowedToPlay && isAllowedResponse?.errors && (
        <ModalNotAllowedToPlay
          isOpen={isOpenNotAlloWedModal}
          onClose={onCloseNotAlloWedModal}
          errors={isAllowedResponse.errors}
        />
      )}
      <ModalRules isOpen={isOpenModalRules} onClose={onCloseModalRules} />
      {gameOverFlag && gameOverMessage.length > 0 && (
        <ModalContainer
          title={'Game over'}
          isOpen={isOpen}
          onClose={closeGameOverModal}
        >
          <GameOverModalContent />
        </ModalContainer>
      )}
      {saveResponse && (
        <ModalContainer
          title={'Error saving game'}
          isOpen={isOpen}
          onClose={onClose}
        >
          <div>
            {saveResponse.map((error, index) => {
              return <div key={index}>{error}</div>;
            })}
          </div>
        </ModalContainer>
      )}
      <ModalContainer
        title={'Cheddar rap'}
        isOpen={videoModalOpened}
        onClose={onCloseVideoModal}
      >
        <div className={styles.videoContainer}>
          <video
            src="../../../assets/cheddar_rap.mp4"
            autoPlay
            controls
          ></video>
        </div>
      </ModalContainer>

      <ModalContainer
        title={'Maze scoreboard'}
        isOpen={isScoreboardOpen}
        onClose={onCloseScoreboard}
      >
        <Scoreboard />
      </ModalContainer>
    </div>
  );
}
