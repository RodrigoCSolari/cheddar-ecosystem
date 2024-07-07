import { Coordinates } from '@/entities/interfaces';
import React, {
  ReactNode,
  createContext,
  useEffect,
  useState,
  KeyboardEvent,
  TouchEvent,
  useRef,
} from 'react';

import { callEndGame, getScoreBoard, getSeedId } from '../queries/api/maze';
import { useWalletSelector } from './WalletSelectorContext';
import { RNG } from '@/entities/RNG';
import {
  IsAllowedResponse,
  ScoreboardResponse,
  useGetIsAllowedResponse,
  useGetPendingCheddarToMint,
  useGetScoreboard,
} from '@/hooks/maze';
import { PlayerScoreData } from '@/components/Scoreboard';
import { NFT, NFTCheddarContract } from '@/contracts/nftCheddarContract';
import { useGetCheddarNFTs } from '@/hooks/cheddar';
import { useDisclosure } from '@chakra-ui/react';
import { getNFTs } from '@/contracts/cheddarCalls';

interface props {
  children: ReactNode;
}

export interface MazeTileData {
  isPath: boolean;
  isActive: boolean;
  enemyWon: boolean;

  hasCheese: boolean;
  hasBag: boolean;
  hasEnemy: boolean;
  hasExit: boolean;
  hasCartel: boolean;
}

const amountOfCheddarInBag = 5;

const pointsOfActions = {
  cheddarFound: 1,
  bagFound: 1,
  enemyDefeated: 1,
  moveWithoutDying: 0,
};

interface GameContextProps {
  mazeData: MazeTileData[][];
  setMazeData: React.Dispatch<React.SetStateAction<MazeTileData[][]>>;

  playerPosition: Coordinates;
  setPlayerPosition: React.Dispatch<React.SetStateAction<Coordinates>>;

  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;

  gameOverFlag: boolean;
  setGameOverFlag: React.Dispatch<React.SetStateAction<boolean>>;

  gameOverMessage: string;
  setGameOverMessage: React.Dispatch<React.SetStateAction<string>>;

  timerStarted: boolean;
  setTimerStarted: React.Dispatch<React.SetStateAction<boolean>>;

  direction: 'right' | 'left' | 'down' | 'up';
  setDirection: React.Dispatch<
    React.SetStateAction<'right' | 'left' | 'down' | 'up'>
  >;

  selectedColorSet: number;
  setSelectedColorSet: React.Dispatch<React.SetStateAction<number>>;

  lastCellX: number;
  setLastCellX: React.Dispatch<React.SetStateAction<number>>;
  lastCellY: number;
  setLastCellY: React.Dispatch<React.SetStateAction<number>>;

  hasPowerUp: boolean;
  setHasPowerUp: React.Dispatch<React.SetStateAction<boolean>>;

  isPowerUpOn: boolean;
  setIsPowerUpOn: React.Dispatch<React.SetStateAction<boolean>>;

  remainingTime: number;
  setRemainingTime: React.Dispatch<React.SetStateAction<number>>;

  timeLimitInSeconds: number;
  setTimeLimitInSeconds: React.Dispatch<React.SetStateAction<number>>;

  remainingMinutes: number;
  setRemainingMinutes: React.Dispatch<React.SetStateAction<number>>;

  remainingSeconds: number;
  setRemainingSeconds: React.Dispatch<React.SetStateAction<number>>;

  cheeseCooldown: boolean;
  setCheeseCooldown: React.Dispatch<React.SetStateAction<boolean>>;

  bagCooldown: boolean;
  setBagCooldown: React.Dispatch<React.SetStateAction<boolean>>;

  enemyCooldown: boolean;
  setEnemyCooldown: React.Dispatch<React.SetStateAction<boolean>>;

  moves: number;
  setMoves: React.Dispatch<React.SetStateAction<number>>;

  won: boolean;
  setWon: React.Dispatch<React.SetStateAction<boolean>>;
  touchStart: Coordinates;
  setTouchStart: React.Dispatch<React.SetStateAction<Coordinates>>;
  touchEnd: Coordinates;
  setTouchEnd: React.Dispatch<React.SetStateAction<Coordinates>>;
  coveredCells: string[];
  setCoveredCells: React.Dispatch<React.SetStateAction<string[]>>;

  mazeRows: number;
  mazeCols: number;
  totalCells: number;
  pathLength: number;

  handleKeyPress(event: KeyboardEvent<HTMLDivElement>): void;
  handleArrowPress(
    direction: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight'
  ): void;

  restartGame(): void;

  calculateBlurRadius(cellX: number, cellY: number): number;

  handleTouchStart: (event: React.TouchEvent<HTMLDivElement>) => void;

  handleTouchMove: (event: React.TouchEvent<HTMLDivElement>) => void;

  cheddarFound: number;

  saveResponse: string[] | undefined;
  hasWon: undefined | boolean;
  pendingCheddarToMint: number;
  endGameResponse: any;

  nfts: NFT[];

  showMovementButtons: boolean;
  setShowMovementButtons: React.Dispatch<React.SetStateAction<boolean>>;

  scoreboardResponse: ScoreboardResponse | null | undefined;
  isLoadingScoreboard: boolean;

  videoModalOpened: boolean;
  onOpenVideoModal: () => void;
  onCloseVideoModal: () => void;

  isScoreboardOpen: boolean;
  onOpenScoreboard: () => void;
  onCloseScoreboard: () => void;
}

export const GameContext = createContext<GameContextProps>(
  {} as GameContextProps
);

export const GameContextProvider = ({ children }: props) => {
  const gameOverRefSent = useRef(false);

  const {
    isOpen: isScoreboardOpen,
    onOpen: onOpenScoreboard,
    onClose: onCloseScoreboard,
  } = useDisclosure();

  const [mazeData, setMazeData] = useState([[]] as MazeTileData[][]);
  const [pathLength, setPathLength] = useState(0);
  const [playerPosition, setPlayerPosition] = useState({ x: 1, y: 1 });
  const [score, setScore] = useState(0);
  const [gameOverFlag, setGameOverFlag] = useState(false);
  const [gameOverMessage, setGameOverMessage] = useState('');
  const [hasWon, setHasWon] = useState<undefined | boolean>(undefined);
  const [timerStarted, setTimerStarted] = useState(false);
  const [startTimestamp, setStartTimestamp] = useState<number | null>(null);
  const [direction, setDirection] = useState(
    'right' as 'right' | 'left' | 'down' | 'up'
  );
  const [selectedColorSet, setSelectedColorSet] = useState(0);
  const [lastCellX, setLastCellX] = useState(-1);
  const [lastCellY, setLastCellY] = useState(-1);
  const [hasPowerUp, setHasPowerUp] = useState(false);
  const [isPowerUpOn, setIsPowerUpOn] = useState(false);

  const [timeLimitInSeconds, setTimeLimitInSeconds] = useState(120);
  const [remainingTime, setRemainingTime] = useState(timeLimitInSeconds);
  const [remainingMinutes, setRemainingMinutes] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const [cheeseCooldown, setCheeseCooldown] = useState(false);
  const [bagCooldown, setBagCooldown] = useState(false);
  const [enemyCooldown, setEnemyCooldown] = useState(false);
  const [moves, setMoves] = useState(0);

  const [won, setWon] = useState(false);
  const [touchStart, setTouchStart] = useState({ x: -1, y: -1 });
  const [touchEnd, setTouchEnd] = useState({ x: -1, y: -1 });
  const [coveredCells, setCoveredCells] = useState<string[]>([]);
  const [cellsWithItemAmount, setCellsWithItemAmount] = useState(0);

  const [cheddarFound, setCheddarFound] = useState(0);

  const [seedId, setSeedId] = useState(0);

  const [rng, setRng] = useState(new RNG(0));

  const [saveResponse, setSaveResponse] = useState();
  const [endGameResponse, setEndGameResponse] = useState();

  const [showMovementButtons, setShowMovementButtons] = useState(true);

  // const [backgroundImage, setBackgroundImage] = useState('');
  // const [rarity, setRarity] = useState('');

  const {
    isOpen: videoModalOpened,
    onOpen: onOpenVideoModal,
    onClose: onCloseVideoModal,
  } = useDisclosure();

  const mazeRows = 11;
  const mazeCols = 9;
  const totalCells = mazeRows * mazeCols;

  const {
    data: pendingCheddarToMint = 0,
    isLoading: isLoadingPendingCheddarToMint,
    refetch: refetchPendingCheddarToMint,
  } = useGetPendingCheddarToMint();

  useEffect(() => {
    function getPathLength() {
      let countPath = 0;
      if (mazeData) {
        mazeData.forEach((row) => {
          row.forEach((cell) => {
            if (cell.isPath) countPath++;
          });
        });
      }
      return countPath;
    }

    setPathLength(getPathLength());
  }, [mazeData, getRandomPathCell]);

  useEffect(() => {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    setRemainingMinutes(minutes);
    setRemainingSeconds(seconds);
  }, [remainingTime]);

  const { accountId, selector } = useWalletSelector();
  const [nfts, setNFTs] = useState<NFT[]>([]);
  const { data: cheddarNFTsData, isLoading: isLoadingCheddarNFTs } =
    useGetCheddarNFTs();

  useEffect(() => {
    if (accountId) {
      getNFTs(accountId).then((nfts) => {
        setNFTs(nfts);
      });
    } else {
      setNFTs([]);
    }
  }, [accountId]);

  // Function to select a random color set, background image, and rarity
  const selectRandomColorSet = () => {
    //Check the global.css file.
    const colorSetsQuantity = 3;

    const randomizeColor = Math.floor(
      Math.floor(Math.random() * colorSetsQuantity) + 1
    );

    return randomizeColor;
  };

  function getRandomPathCell(mazeData: MazeTileData[][]) {
    const pathCells: Coordinates[] = [];
    mazeData.map((row: MazeTileData[], rowIndex: number) => {
      row.map((cell: MazeTileData, colIndex: number) => {
        if (cell.isPath) {
          pathCells.push({ x: colIndex, y: rowIndex });
        }
      });
    });

    return pathCells[rng.nextRange(0, pathCells.length)];
  }

  // Function to restart the game
  async function restartGame() {
    if (!accountId) {
      return;
    }

    const newSeedIdResponse = await getSeedId(accountId);
    await refetchPendingCheddarToMint();
    setSeedId(newSeedIdResponse.seedId);

    setHasWon(undefined);
    setTimerStarted(true);
    setStartTimestamp(Date.now());
    // clearInterval(timerId);
    setScore(0);
    setTimeLimitInSeconds(120);
    setRemainingTime(120);
    setCheddarFound(0);
    setCheeseCooldown(false);
    setBagCooldown(false);
    // setEnemyCooldown(false);
    setMoves(0);
    setGameOverFlag(false);
    setWon(false);
    setGameOverMessage('');
    setDirection('right');
    setCoveredCells([]);
    setSaveResponse(undefined);
    setEndGameResponse(undefined);
    setCellsWithItemAmount(0);

    gameOverRefSent.current = false;

    // Regenerate maze data
    const rng = new RNG(newSeedIdResponse.seedId);
    setRng(rng);

    const newMazeData = generateMazeData(mazeRows, mazeCols, rng);

    // Set the maze data with the new maze and player's starting position
    setMazeData(newMazeData);

    const playerStartCell = getRandomPathCell(newMazeData);
    setPlayerPosition({ x: playerStartCell.x, y: playerStartCell.y });
    setLastCellX(-1);
    setLastCellY(-1);
  }

  // Function to generate maze data
  function generateMazeData(rows: number, cols: number, rng: RNG) {
    const maze = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({
        isPath: false,
        isActive: false,
        hasCheese: false,
        hasBag: false,
        hasEnemy: false,
        hasExit: false,
        enemyWon: false,
        hasCartel: false,
      }))
    );

    // Choose a random starting position on the outer border
    const startEdge = rng.nextRange(0, 4); // 0: top, 1: right, 2: bottom, 3: left
    let x: number, y: number;

    switch (startEdge) {
      case 0: // Top edge
        x = rng.nextRange(1, cols - 2);
        y = 0;
        break;
      case 1: // Right edge
        x = cols - 1;
        y = rng.nextRange(1, rows - 2);
        break;
      case 2: // Bottom edge
        x = rng.nextRange(1, cols - 2);
        y = rows - 1;
        break;
      case 3: // Left edge
        x = 0;
        y = rng.nextRange(1, rows - 2);
        break;
    }
    maze[y!][x!].isPath = true;

    const stack = [[x!, y!]];

    while (stack.length) {
      const [cx, cy] = stack[stack.length - 1];
      const directions: number[][] = [];

      // Check all possible directions
      [
        [2, 0], // Increase step to 2 for wider paths
        [-2, 0], // Increase step to 2 for wider paths
        [0, 2], // Increase step to 2 for wider paths
        [0, -2], // Increase step to 2 for wider paths
      ].forEach(([dx, dy]) => {
        const nx = cx + dx,
          ny = cy + dy;
        if (
          nx >= 0 &&
          nx < cols &&
          ny >= 0 &&
          ny < rows &&
          !maze[ny][nx].isPath
        ) {
          directions.push([nx, ny, cx + dx / 2, cy + dy / 2]); // Adjust coordinates for wider paths
        }
      });

      if (directions.length) {
        const [nx, ny, px, py] =
          directions[rng.nextRange(0, directions.length)];
        maze[ny][nx].isPath = true;
        maze[py][px].isPath = true;
        stack.push([nx, ny]);
      } else {
        stack.pop();
      }
    }

    return maze;
  }

  // Inside the component where you're using the Maze component
  useEffect(() => {
    // Generate maze data and set it to the state
    const newMazeData = generateMazeData(mazeRows, mazeCols, new RNG(0));
    setMazeData(newMazeData);

    const randomColorSet = selectRandomColorSet();
    setSelectedColorSet(randomColorSet);
    // setBackgroundImage(randomColorSet.backgroundImage);
    // setRarity(randomColorSet.rarity);

    const playerStartCell = getRandomPathCell(newMazeData);
    setPlayerPosition({ x: playerStartCell.x, y: playerStartCell.y });
  }, []); // Empty dependency array to run this effect only once on component mount

  function movePlayer(newX: number, newY: number) {
    if (
      !mazeData[newY] ||
      !mazeData[newY][newX] ||
      !mazeData[newY][newX].isPath
    ) {
      return; // Player cannot move to non-path cells
    }

    const newMazeData = mazeData.map((row: MazeTileData[], rowIndex: number) =>
      row.map((cell: MazeTileData, colIndex: number) => ({
        ...cell,
        isActive: rowIndex === newY && colIndex === newX,
      }))
    );

    // Reset isActive for the previous player position
    newMazeData[playerPosition.y][playerPosition.x].isActive = false;

    // Update player position state
    setPlayerPosition({ x: newX, y: newY });

    // Update mazeData state
    setMazeData(newMazeData);

    // Increment moves count
    setMoves(moves + 1);
    if (!coveredCells.includes(`${newX}${newY}`)) {
      let newCoveredCells = coveredCells;
      newCoveredCells.push(`${newX}${newY}`);
      setCoveredCells(newCoveredCells);
    }

    // Periodically add artifacts to the board based on cooldowns and randomness
    addArtifacts(newX, newY, newMazeData, moves);

    // Set lastCellX and lastCellY to the new player position
    // Update last cell coordinates
    setLastCellX(playerPosition.x);
    setLastCellY(playerPosition.y);
  }

  function doesCellHasArtifact(x: number, y: number) {
    return (
      mazeData[y][x].hasCheese ||
      mazeData[y][x].hasBag ||
      mazeData[y][x].hasEnemy ||
      mazeData[y][x].hasCartel ||
      mazeData[y][x].hasExit
    );
  }

  function handleEnemyFound(
    clonedMazeData: MazeTileData[][],
    x: number,
    y: number
  ) {
    // 30% chance of encountering an enemy
    // Code for adding enemy artifact...
    setCellsWithItemAmount(cellsWithItemAmount + 1);
    // Add logic for the enemy defeating the player
    if (rng.nextFloat() < 0.02) {
      // 2% chance of the enemy winning
      clonedMazeData[y][x].enemyWon = true;
      clonedMazeData[y][x].isActive = false;

      gameOver('Enemy won! Game Over!', false);
    } else {
      clonedMazeData[y][x].hasEnemy = true;

      setScore(score + pointsOfActions.enemyDefeated);
      // setEnemyCooldown(true);
      setTimeout(
        () => {
          // setEnemyCooldown(false);
        },
        rng.nextRange(1000, 6000)
      );
    }
  }

  function handleCheeseFound(
    clonedMazeData: MazeTileData[][],
    x: number,
    y: number
  ) {
    // 5.5% chance of winning cheese
    clonedMazeData[y][x].hasCheese = true;
    setCellsWithItemAmount(cellsWithItemAmount + 1);
    setScore(score + pointsOfActions.cheddarFound);
    setCheddarFound(cheddarFound + 1);
    setCheeseCooldown(true);
    setTimeout(
      () => {
        setCheeseCooldown(false);
      },
      rng.nextRange(1000, 6000)
    );
  }

  function handleBagFound(
    clonedMazeData: MazeTileData[][],
    x: number,
    y: number
  ) {
    // 5.5% chance of winning cheese
    clonedMazeData[y][x].hasBag = true;
    setCellsWithItemAmount(cellsWithItemAmount + 1);
    setScore(score + pointsOfActions.bagFound);
    setCheddarFound(cheddarFound + 1 * amountOfCheddarInBag);
    setBagCooldown(true);
    setTimeout(
      () => {
        setBagCooldown(false);
      },
      rng.nextRange(1000, 11000)
    );
  }

  function handleCartelFound(
    clonedMazeData: MazeTileData[][],
    x: number,
    y: number
  ) {
    // 0.2% chance of hitting the "cartel" event
    clonedMazeData[y][x].hasCartel = true;
    setCellsWithItemAmount(cellsWithItemAmount + 1);
    gameOver('You ran into the cartel! Game Over!', false);
  }

  function handleExitFound(
    clonedMazeData: MazeTileData[][],
    x: number,
    y: number
  ) {
    clonedMazeData[y][x].hasExit = true;
    setCellsWithItemAmount(cellsWithItemAmount + 1);
    gameOver('Congrats! You found the Hidden Door.', true);
  }

  const chancesOfFinding = {
    exit: 0.002,
    enemy: 0.19,
    cheese: 0.055,
    bag: 0.027,
    cartel: 0.0002,
  };

  const NFTCheeseBuffMultiplier = 1.28;
  const NFTExitBuffMultiplier = 10;

  function getChancesOfFindingCheese() {
    if (nfts.length > 0) {
      return chancesOfFinding.cheese * NFTCheeseBuffMultiplier;
    }
    return chancesOfFinding.cheese;
  }

  function getChancesOfFindingExit() {
    if (nfts.length > 0) {
      return chancesOfFinding.exit * NFTExitBuffMultiplier;
    }
    return chancesOfFinding.exit;
  }

  function addArtifacts(
    newX: number,
    newY: number,
    newMazeData: MazeTileData[][],
    moves: number
  ) {
    if (gameOverFlag /* && moves >= 10*/) {
      return;
    }
    if (doesCellHasArtifact(newX, newY)) {
      return;
    }
    let clonedMazeData = [...newMazeData];
    if (
      (rng.nextFloat() < getChancesOfFindingExit() &&
        coveredCells.length >= 0.75 * pathLength) ||
      pathLength - cellsWithItemAmount === 1
    ) {
      handleExitFound(clonedMazeData, newX, newY);
    } else if (!enemyCooldown && rng.nextFloat() < chancesOfFinding.enemy) {
      handleEnemyFound(clonedMazeData, newX, newY);
    } else if (
      !cheeseCooldown &&
      rng.nextFloat() < getChancesOfFindingCheese()
    ) {
      handleCheeseFound(clonedMazeData, newX, newY);
    } else if (!bagCooldown && rng.nextFloat() < chancesOfFinding.bag) {
      handleBagFound(clonedMazeData, newX, newY);
    } else if (rng.nextFloat() < chancesOfFinding.cartel) {
      handleCartelFound(clonedMazeData, newX, newY);
    } else {
      setScore(score + pointsOfActions.moveWithoutDying);
    }
    setMazeData(clonedMazeData);
  }

  function stopTimer() {
    // clearInterval(timerId);
    setTimerStarted(false);
  }

  // Function to handle game over
  async function gameOver(message: string, won: boolean) {
    if (gameOverRefSent.current) {
      return;
    }

    gameOverRefSent.current = true;

    const cheddarToEarn =
      cheddarFound <= pendingCheddarToMint
        ? cheddarFound
        : pendingCheddarToMint;

    const endGameRequestData = {
      data: {
        cheddarEarned: won ? cheddarToEarn : 0,
        score,
        path: [],
      },
      metadata: {
        accountId: accountId!,
        seedId,
      },
    };

    setHasWon(won);
    setCoveredCells([]);
    setGameOverFlag(true);
    setGameOverMessage(message);
    stopTimer();

    const endGameResponse = await callEndGame(endGameRequestData);
    setEndGameResponse(endGameResponse);
    if (!endGameResponse.ok) setSaveResponse(endGameResponse.errors);
  }

  // Define a new useEffect hook to manage the timer
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (timerStarted && !gameOverFlag && startTimestamp) {
      intervalId = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 0 && intervalId) {
            // if (intervalId && true) {
            clearInterval(intervalId);
            setStartTimestamp(null);
            gameOver("⏰ Time's up! Game Over!", false);
            return prevTime;
          }
          return Math.floor(
            startTimestamp / 1000 + timeLimitInSeconds - Date.now() / 1000
          );
        });
      }, 500);
    } else {
      if (intervalId) clearInterval(intervalId);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    }; // Cleanup function to clear interval on unmount or when timer conditions change
  }, [timerStarted, gameOverFlag]);

  function handleMoveByArrow(direction: string) {
    if (gameOverFlag) return; // If game over, prevent further movement

    let newX = playerPosition.x;
    let newY = playerPosition.y;

    switch (direction) {
      case 'ArrowUp':
        newY--;
        setDirection('up');
        break;
      case 'ArrowDown':
        newY++;
        setDirection('down');
        break;
      case 'ArrowLeft':
        newX--;
        setDirection('left');
        break;
      case 'ArrowRight':
        newX++;
        setDirection('right');
        break;
      default:
        return;
    }

    movePlayer(newX, newY);
    // Update last cell coordinates
    setLastCellX(playerPosition.x);
    setLastCellY(playerPosition.y);
  }

  // Function to handle key press events
  function handleKeyPress(event: KeyboardEvent<HTMLDivElement>) {
    const key = event.key;
    handleMoveByArrow(key);
  }

  function handleArrowPress(
    direction: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight'
  ) {
    handleMoveByArrow(direction);
  }

  function calculateBlurRadius(cellX: number, cellY: number) {
    return 0;
    // Check if it can be fixed. It looks bad even with maxBlurRadius=1
    // Check if lastCellX and lastCellY are null or undefined
    if (lastCellX === -1 || lastCellY === -1) {
      // Initialize lastCellX and lastCellY with initial player position
      setLastCellX(playerPosition.x);
      setLastCellY(playerPosition.y);
    }

    // Calculate distance between current cell and last cell
    const distance = Math.sqrt(
      Math.pow(cellX - lastCellX, 2) + Math.pow(cellY - lastCellY, 2)
    );

    // Define max blur radius and adjust based on distance
    const maxBlurRadius = 0; // Adjust as needed
    return Math.min(maxBlurRadius, distance);
  }

  function getCoordinatesFromTileId(id: string) {
    const stringCoordinates = id.slice('cell-'.length);

    const splitStringCoordinates = stringCoordinates.split('-');

    const finalCoordinate = {
      y: Number(splitStringCoordinates[0]),
      x: Number(splitStringCoordinates[1]),
    };

    return finalCoordinate as Coordinates;
  }

  function isValidTileToMove(coordinates: Coordinates) {
    //If the coordinate is part of the path
    const isPath = mazeData[coordinates.y][coordinates.x].isPath;

    //If the coordinate is next to player location (discarding diagonals)
    const isNextToPlayer =
      ((playerPosition.y + 1 === coordinates.y ||
        playerPosition.y - 1 === coordinates.y) &&
        playerPosition.x === coordinates.x) ||
      ((playerPosition.x + 1 === coordinates.x ||
        playerPosition.x - 1 === coordinates.x) &&
        playerPosition.y === coordinates.y);

    return isPath && isNextToPlayer;
  }

  function moveIfValid(id: string) {
    if (id) {
      const touchedCoordinate = getCoordinatesFromTileId(id);

      if (isValidTileToMove(touchedCoordinate)) {
        let newX = playerPosition.x;
        let dX = playerPosition.x - touchedCoordinate.x;

        let newY = playerPosition.y;
        let dY = playerPosition.y - touchedCoordinate.y;

        let newDirection = '' as React.SetStateAction<
          'right' | 'left' | 'down' | 'up'
        >;

        if (dX === 1) {
          newDirection = 'left';
          newX--;
        } else if (dX === -1) {
          newDirection = 'right';
          newX++;
        } else if (dY === 1) {
          newDirection = 'up';
          newY--;
        } else if (dY === -1) {
          newDirection = 'down';
          newY++;
        }

        setDirection(newDirection);

        movePlayer(newX, newY);
        // Update last cell coordinates
        setLastCellX(playerPosition.x);
        setLastCellY(playerPosition.y);
      }

      // setTouchedSquares([id]);
    }
  }

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!showMovementButtons) {
      // event.preventDefault(); // Prevent screen scroll
      const touches = event.touches;
      const initialTouch = touches[0] as Touch;

      const initialSquareId = getSquareIdFromTouch(initialTouch);

      if (!gameOverFlag) moveIfValid(initialSquareId!);
    }
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!showMovementButtons) {
      event.preventDefault(); // Prevent screen scroll
      const touches = event.touches;

      // Calculate touchedSquares
      for (let i = 0; i < touches.length; i++) {
        const currentTouch = touches[i] as Touch;

        const tileId = getSquareIdFromTouch(currentTouch);

        if (!gameOverFlag && tileId) {
          moveIfValid(tileId);
        }
      }
    }
  };

  const getSquareIdFromTouch = (touch: Touch) => {
    const square = document.elementFromPoint(touch.clientX, touch.clientY);

    return square?.id || '';
  };

  const { data: scoreboardResponse, isLoading: isLoadingScoreboard } =
    useGetScoreboard();

  return (
    <GameContext.Provider
      value={{
        mazeData,
        setMazeData,
        playerPosition,
        setPlayerPosition,
        score,
        setScore,
        gameOverFlag,
        setGameOverFlag,
        gameOverMessage,
        setGameOverMessage,
        timerStarted,
        setTimerStarted,
        direction,
        setDirection,
        selectedColorSet,
        setSelectedColorSet,
        lastCellX,
        setLastCellX,
        lastCellY,
        setLastCellY,
        hasPowerUp,
        setHasPowerUp,
        isPowerUpOn,
        setIsPowerUpOn,
        timeLimitInSeconds,
        setTimeLimitInSeconds,
        remainingTime,
        setRemainingTime,
        remainingMinutes,
        setRemainingMinutes,
        remainingSeconds,
        setRemainingSeconds,
        cheeseCooldown,
        setCheeseCooldown,
        bagCooldown,
        setBagCooldown,
        enemyCooldown,
        setEnemyCooldown,
        moves,
        setMoves,
        won,
        setWon,
        touchStart,
        setTouchStart,
        touchEnd,
        setTouchEnd,
        coveredCells,
        setCoveredCells,
        mazeRows,
        mazeCols,
        totalCells,
        pathLength: pathLength,
        handleKeyPress,
        handleArrowPress,
        restartGame,
        calculateBlurRadius,
        handleTouchStart,
        handleTouchMove,
        cheddarFound,
        saveResponse,
        hasWon,
        pendingCheddarToMint,
        endGameResponse,
        videoModalOpened,
        onOpenVideoModal,
        onCloseVideoModal,
        nfts,

        showMovementButtons,
        setShowMovementButtons,
        scoreboardResponse,
        isLoadingScoreboard,
        isScoreboardOpen,
        onOpenScoreboard,
        onCloseScoreboard,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
