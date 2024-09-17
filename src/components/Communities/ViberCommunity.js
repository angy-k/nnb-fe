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
        //https://l.instagram.com/?u=https%3A%2F%2Finvite.viber.com%2F%3Fg2%3DAQBR%252B5ef5lKUX1MxICpe2OAUY8lYMdQcNtmvse9JE0D1fZBOi8mWfzr3nMxcOCSU&e=AT2EX3a-2QilL0lvqIk36AfemA_3QiutW-mSyEAtEAF62EW0-tM-a2FGmCSa1Tr0mtgz1zsnYftBkKPZve5sVdV9C8deGbXyEMhb6w
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