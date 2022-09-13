import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [language, setLanguage] = React.useState(true)
    const [rolls, setRolls] = React.useState(0)
    const [best, setBest] = React.useState(localStorage.getItem("best") || null)
    
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
        }
    }, [dice])

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function rollDice() {
        if(!tenzies) {
            setRolls(prevRolls => prevRolls+1)
            
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
        } else {
            if(best > rolls || best===null){
                setBest(rolls)
                localStorage.setItem("best", rolls)
            }
            setRolls(prevRolls => prevRolls = 0)
            setTenzies(false)
            setDice(allNewDice())
            
        }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {value: die.value, isHeld: !die.isHeld, id: die.id} :
                die
        }))
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    function languageChange(){
        setLanguage(prevLanguage => !prevLanguage)
    }
    
    return (
        <main>
            {tenzies && <Confetti width={window.innerWidth}/>}
            <div className="timerLanguage-container">
                <button className="change-language" onClick={languageChange}>{language ? "SK" : "EN"}</button>
                <p className="rolls-attempts">{language ? `Number of rolls: ${rolls}` : `Počet hodov: ${rolls}`}</p>
                <p className="rolls-best">{language ? "Best score: " : "Najlepšie skóre: "} {best}</p>
            </div>
            <h1 className="title">Tenzies</h1>
            <p className="instructions">{language ? "Roll until all dice are the same.\nClick on a selected die to freeze it at its current value between rolls." : "Hádžte, kým nebudú všetky kocky rovnaké.\nKliknutím na vybranú kocku ju medzi hodmi zmrazíte na jej aktuálnej hodnote."}</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
        </main>
    )
}