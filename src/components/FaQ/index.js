'use client'
import {Accordion, AccordionItem} from "@nextui-org/accordion";
import PlusIcon from '@/icons/plus-icon.svg';
import MinusIcon from '@/icons/minus-icon.svg';
import Image from 'next/image'

const Faq = ({
    faq = mockedFaQ
}) => {
  return (
    <div className="grid place-items-center w-full pb-15 w-full mx-auto 2xl:max-w-screen-2xl 2xl:mx-auto" style={{background: 'linear-gradient(to bottom, #261A54 30%, #f0f0f0 30%)'}}>
      <div className="faq-container place-items-center p-5 w-full mx-auto lg:w-1440 2xl:max-w-screen-2xl 2xl:mx-auto">
        {faq && <Accordion variant="light">
            {faq.map((item, index) => (
                <AccordionItem 
                  key={`faq-item-${index}`} 
                  aria-label={`Faq - ${index}`} 
                  title={item.question}
                  className="faq-container-accordion mb-5"
                  focusable={false}
                  indicator={({ isOpen }) => (!!isOpen ? <Image
                    src={MinusIcon}
                    alt="eye-unseen"
                    width="0"
                    height="0"
                    className='w-18 pr-4'
                  /> : <Image
                  src={PlusIcon}
                  alt="eye-unseen"
                  width="0"
                  height="0"
                  className='w-18 pr-4'
                />)}
                >
                    <p className="section p-0 m-0">{item.answer}</p>
              </AccordionItem>
            ))}
        </Accordion>}
      </div>
    </div>
  );
}
const mockedFaQ = [
  {
    id: 1,
    question: "Ovde će pisati pitanje",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    id: 2,
    question: "Najčešće postavljeno pitanje",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",

  },
  {
    id: 3,
    question: "Najčešće postavljeno pitanje",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",

  },
  {
    id: 4,
    question: "Najčešće postavljeno pitanje",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    id: 5,
    question: "Najčešće postavljeno pitanje",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
];
export default Faq;
