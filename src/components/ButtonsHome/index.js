import Button from "../Button";
import MarketIcon from "../../icons/market-icon.svg";
import UsersGroupIcon from "../../icons/users-group-icon.svg";
import EventIcon from "../../icons/event-icon.svg";


const Home = () => {
    return (
        <>
            <div>
                <div>
                    <Button 
                        type={'title-description-button'}
                        color={'orange'}
                        name={'114'}
                        description={'događaja'}
                    />
                    <Button 
                        type={'icon'}
                        color={'lightBlue'}
                        iconPath={MarketIcon}
                        iconSize={108}
                        iconAlt={'market icon'}
                    />
                    <Button 
                        type={'title-description'}
                        color={'yellow'}
                    name={'114'}
                    description={'događaja'}
                    />
                </div>
                <div>
                    <Button 
                        type={'icon'}
                        color={'orange'}
                        iconPath={EventIcon}
                        iconSize={108}
                        iconAlt={'market icon'}
                    />
                    <Button 
                        type={'title-description'}
                        color={'lightBlue'}
                        name={'114'}
                        description={'događaja'}
                    />
                    <Button 
                        type={'icon'}
                        color={'yellow'}
                        iconPath={UsersGroupIcon}
                        iconSize={108}
                        iconAlt={'market icon'}
                    />
                </div>
            </div>
        </>
    )
}

export default Home;