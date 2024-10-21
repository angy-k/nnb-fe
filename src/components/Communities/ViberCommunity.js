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
    <div className={`${type === 'dark' ? "viber-community-dark" : "viber-community-light"} place-items-center justify-center grid md:flex lg:flex pb-3 mt-24 w-full lg:w-1440 md:mx-auto lg:mx-auto 2xl:max-w-screen-2xl 2xl:mx-auto`}>
      <Image
        // className="hidden md:flex lg:flex sm:left-0"
        src={OwlsCommunity}
        width="0"
        height="0"
        className='w-135'
        alt={'Viber community owls icon.'}
        style={{marginLeft: '-45px'}}
      />
      <div className="grid lg:flex place-items-center justify-space-between ">
        <div className="flex place-items-center">
          <Image
            // className="flex md:hidden lg:flex sm:left-0"
            src={ViberIcon}
            width="0"
            height="0"
            className='w-14'
            alt={'Viber community viber icon.'}
            color={type === 'dark' ? "#ffffff" : "#261A54"}
          />
          <span className={"viber-community-text px-3"}>{'Postani deo Viber zajednice'}</span>
        </div>
        <Button
          key={`viber-community-button`}
          type={'outlined-white'}
          name={'Pristupi grupi'}
          onClick={joinCommunity()}
        />
      </div>
    </div>
  )
}

export default ViberCommunity;
