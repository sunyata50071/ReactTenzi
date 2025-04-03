import './App.css';
import { useState, useRef, useEffect } from "react"
import Die from "./Die"
import { nanoid } from "nanoid"
import Confetti from "react-confetti"
import { library } from '@fortawesome/fontawesome-svg-core'
import { faDice } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
library.add(faDice)
const diceIcon = <FontAwesomeIcon icon={faDice} />

function App() {
    
    const [dice, setDice] = useState(() => generateAllNewDice())
    const keyboardRef = useRef(null)
    
    const gameWon = dice.every(die => die.isHeld) &&
        dice.every(die => die.value === dice[0].value)
        
    useEffect(() => {
        if (gameWon) {
            keyboardRef.current.focus()
        }
    }, [gameWon])

    function generateAllNewDice() {
        return new Array(10)
            .fill(0)
            .map(() => ({
                value: Math.ceil(Math.random() * 6),
                isHeld: false,
                id: nanoid()
            }))
    }
    
    function rollDice() {
        if (!gameWon) {
            setDice(oldDice => oldDice.map(die =>
                die.isHeld ?
                    die :
                    { ...die, value: Math.ceil(Math.random() * 6) }
            ))
        } else {
            setDice(generateAllNewDice())
        }
    }

    function hold(id) {
        setDice(oldDice => oldDice.map(die =>
            die.id === id ?
                { ...die, isHeld: !die.isHeld } :
                die
        ))
    }

    const diceElements = dice.map(dieObj => (
        <Die
            key={dieObj.id}
            value={dieObj.value}
            isHeld={dieObj.isHeld}
            hold={() => hold(dieObj.id)}
        />
    ))

    return (
        <main>
            {gameWon && <Confetti />}
            <div aria-live="polite" className="sr-only">
                {gameWon && <p>10 matching numbers! You won! Press "New Game" to keep playing.</p>}
            </div>
            <h1 className="title">Tenzi</h1>
            <p className="instructions">Hold 10 matching numbers to win. Click or hit the spacebar to roll the dice, then choose which numbers to hold.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button ref={keyboardRef} className="roll-dice" onClick={rollDice}>
                {gameWon ? "New game" : diceIcon}
            </button>
        </main>
    )
}

export default App;
