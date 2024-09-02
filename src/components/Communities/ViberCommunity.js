import ViberIcon from "../../icons/viber-icon.svg"
import OwlsCommunity from "../../icons/owls-community.svg"
import office from "../../../office-config/config.json"
import Image from 'next/image'
import Button from "../Button"

const ViberCommunity = ({
    type = 'dark'
}) => {
    function joinCommunity() {
        //TODO: join viber community
    }
    return(
        <div className={type === 'dark' ? "viber-community-dark" : "viber-community-light"}>
            <Image
                src={OwlsCommunity}
                width={597}
                height={157}
                alt={'Viber community owls icon.'}
            />
            <Image
                src={ViberIcon}
                width={68}
                height={68}
                alt={'Viber community viber icon.'}
                color={type === 'dark' ? "#ffffff" : "#261A54"}
            />
            <span className={"viber-community-text"}>{'Postani deo Viber zajednice'}</span>
            <Button
                key={`viber-community-button`}
                type={'outlined-white'}
                name={'Pristupi grupi'}
                onClick={joinCommunity()}
            />
        </div>
    )
}

export default ViberCommunity;