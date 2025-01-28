import { useState } from "react"
import { Square } from "./components/Square.jsx"
import confetti from 'canvas-confetti'
import {turns} from './constants.js'
import { checkWinnerFrom, checkEndGame } from "./logic/board.js"
import { WinnerModal } from "./components/WinnerModal.jsx"

function App() {
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem('board')
    if(boardFromStorage) return JSON.parse(boardFromStorage)
    return Array(9).fill(null)
  })
  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn')
    return turnFromStorage ?? turns.X
  })
  const [winner, setWinner] = useState(null)

  const updateBoard = (index) => {
    // no actualizar si la posicion
    // ya tiene valor
    if(board[index] || winner) return

    // actualizar el tabler 
    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)

    // Cambiar turno
    const newTurn = turn === turns.X ? turns.O : turns.X
    setTurn(newTurn)
    // Guardar partida 
    window.localStorage.setItem('board', JSON.stringify(newBoard))
    window.localStorage.setItem('turn', newTurn)

    // revisar si hay ganador
    const newWinner = checkWinnerFrom(newBoard)
    if(newWinner){
      confetti()
      setWinner(newWinner)
    } else if(checkEndGame(newBoard)){
      setWinner(false)
    }
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(turns.X)
    setWinner(null)
    window.localStorage.removeItem('turn')
    window.localStorage.removeItem('board')
  }

  return (
    <>
    <main className="board">
        <h1>Tic-tac-toe</h1>
        <button onClick={resetGame}>Reset Game</button>
        <section className="game">
          {
            board.map((_, index) => {
              return (
                <Square 
                  key={index}
                  index={index}
                  updateBoard={updateBoard}
                >
                  {board[index]}
                </Square>
              )
            })
          }
        </section>
        <section className="turn">
          <Square isSelected={turn == turns.X}>{turns.X}</Square>
          <Square isSelected={turn == turns.O}>{turns.O}</Square>
        </section>

        <WinnerModal resetGame={resetGame} winner={winner}/>
    </main>
    </>
  )
}

export default App
