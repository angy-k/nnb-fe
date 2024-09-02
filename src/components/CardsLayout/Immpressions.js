import React, { useState } from "react"
import CardComponent from "../CardComponent";
import PlusIcon from "../../icons/plus-icon.svg"


const Immpressions = ({
    immpressions
}) => {
    const [isPaused, setPause] = useState(false);
    function previewFullImmpression() {
        setPause(true)
        //TODO: preview full immpression - open modal with full content
        setTimeout(() => {
            setPause(false)
        }, 500)
    }
    return (
        <div className="immpressions-container">
            <div className="immpressions-scroll-content">
            {immpressions.map((immpression) => {
                <CardComponent 
                    key={`immpression-card`}
                    sectionType={`immpression`}
                    author={immpression.author}
                    buttonIcon={PlusIcon}
                    buttonIconSize={22.6}
                    onClick={previewFullImmpression()}
                    className="immpression-card"
                />
            })}
            </div>
        </div>
    )
}

export default Immpressions;