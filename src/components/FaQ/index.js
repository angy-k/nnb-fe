import {Accordion, AccordionItem} from "@nextui-org/react";

const Faq = ({
    faq
}) => {
  const defaultContent =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

  return (
    <div className="faq-container">
    <Accordion variant="splitted">
        {faq.map((item, index) => {
            <AccordionItem key={`faq-item-${index}`} aria-label={`Faq - ${index}`} title={item.question}>
                {item.answer}
          </AccordionItem>
        })}
    </Accordion>
    </div>
  );
}

export default Faq;
